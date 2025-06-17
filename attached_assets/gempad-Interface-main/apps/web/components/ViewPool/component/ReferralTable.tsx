import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Address, useNetwork } from 'wagmi';
import { shortenAddress } from '@/utils/format';
import { CallState, useSingleContractMultipleData } from '@/state/multicall/hooks';
import { LaunchpadABI } from '@/config/abi/launchpad';
import { formatUnits } from 'viem';
import CopyableElement from '@/components/CopyableElement';
import { Box } from '@mui/material';

interface IReferralTable {
    fundTokenDecimals: number;
    fundTokenSymbol: string;
    allReferrers: readonly Address[];
    launchpadContract: any;
    rewardInfo: CallState<any[]>[];
    totalReward: number;
    totalRaisedNum: number;
    fee: number;
    affiliatePercentage: number;
    referralsInvestment: number;
    total: number;
}

export default function ReferralTable({
    fundTokenDecimals,
    fundTokenSymbol,
    allReferrers,
    launchpadContract,
    rewardInfo,
    totalReward,
    totalRaisedNum,
    fee,
    affiliatePercentage,
    referralsInvestment,
    total,
}: IReferralTable) {
    return (
        <TableContainer component={Paper} sx={{ background: 'transparent', boxShadow: 'none' }}>
            <Table aria-label="simple table">
                <TableHead sx={{ background: '' }}>
                    <TableRow>
                        <TableCell sx={{ padding: '6px' }}>Address</TableCell>
                        <TableCell sx={{ padding: '6px' }} align="right">
                            Amount ({`${fundTokenSymbol}`})
                        </TableCell>
                        <TableCell sx={{ padding: '6px' }} align="right">
                            Rewards ({`${fundTokenSymbol}`})
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {allReferrers?.map((row, id) => {
                        // result: [
                        // 0: referralInvest: bigint
                        // 1 : userShare: bigint
                        // ]
                        const referralInvest = rewardInfo?.[id]?.result?.[0];
                        const userShare = rewardInfo?.[id]?.result?.[1];

                        const referralInvestInFundToken = +formatUnits(
                            referralInvest ?? 0n,
                            fundTokenDecimals ?? 18,
                        );
                        const userShareInFundToken = +formatUnits(
                            userShare ?? 0n,
                            fundTokenDecimals ?? 18,
                        );
                        const userReward =
                            (total * referralInvestInFundToken) / referralsInvestment;
                        // const rewardPercentage = (userShareInFundToken / referralsInvestment) * 100
                        const rewardPercentage =
                            (referralInvestInFundToken / referralsInvestment) * 100;
                        return (
                            <TableRow
                                // eslint-disable-next-line react/no-array-index-key
                                key={id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell
                                    sx={{ padding: '6px' }}
                                    component="th"
                                    scope="row"
                                    align="left"
                                    color="#22CDA6"
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'start',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Box mr={1}>{shortenAddress(row)}</Box>
                                        <CopyableElement value={row} />
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ padding: '6px' }} align="right">
                                    {referralInvestInFundToken} ({rewardPercentage.toFixed(1)}%)
                                </TableCell>
                                {/* <TableCell sx={{ padding: '6px' }} align="right">{userShareInFundToken}</TableCell> */}
                                <TableCell sx={{ padding: '6px' }} align="right">
                                    {userReward}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
