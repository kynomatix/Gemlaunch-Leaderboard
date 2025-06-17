import MainModal from '@/components/Modals';
import React from 'react';
import { HistoryModalProps } from '../types';
import { useSingleCallResult, useSingleContractMultipleData } from '@/state/multicall/hooks';
import { useSubscriptionContract } from '@/hooks/useContract';
import {
    Paper,
    Table,
    TableCell,
    TableContainer,
    TableRow,
    TableBody,
    TableHead,
    Tooltip,
    Box,
    Zoom,
    Typography,
} from '@mui/material';
import { formatUnits } from 'viem';
import { shortenAddress } from '@/utils/format';
import CopyIcon from 'public/assets/icons/copy.svg';
import { calculateTokenAmount } from '../utils';
import { tableContainerStyles } from '../constant';
import AppPagination from '@/components/AppPagination/AppPagination';
import TablePagination from '@/components/TablePagination/TablePagination';
import NoData from '@/components/NoData/NoData';

const HistoryModal: React.FC<HistoryModalProps> = ({
    onClose,
    openModal,
    subscriptionPoolAddress,
    fundTokenDecimals,
    fundTokenSymbol,
    launchpadTokenSymbol,
    launchpadTokenDecimals,
    sellRateNum,
}) => {
    const [open, setOpen] = React.useState<{ [key: number]: boolean }>({});

    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 9;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    React.useEffect(() => {
        if (openModal) {
            setCurrentPage(1);
        }
    }, [openModal]);

    const subscriptionPoolContract = useSubscriptionContract(subscriptionPoolAddress);
    const { result: users, loading } = useSingleCallResult({
        contract: subscriptionPoolContract,
        functionName: 'getAllInvestors',
    });

    const response = useSingleContractMultipleData({
        contract: {
            abi: subscriptionPoolContract.abi,
            address: subscriptionPoolContract.address,
        },
        functionName: 'userInfo',
        args: users ? users.map((x) => [x] as [`0x${string}`]) : [],
    });

    const userInfo = response?.map((x) => x.result);
    const totalInvestedAmount = userInfo?.reduce(
        (acc, x) => acc + +formatUnits(x?.[0] ?? 0n, fundTokenDecimals ?? 18),
        0,
    );
    const totalAllocatedAmountBNB = userInfo?.reduce(
        (acc, x) =>
            acc +
            calculateTokenAmount(
                +formatUnits(x?.[2] ?? 0n, launchpadTokenDecimals ?? 18),
                sellRateNum,
            ),
        0,
    );

    const isDataAvailable = users?.length > 0;

    const handleCopy = async (text: string, index: number) => {
        try {
            await navigator.clipboard.writeText(text as string);
            setOpen((prev) => ({ ...prev, [index]: true }));
            setTimeout(() => {
                setOpen((prev) => ({ ...prev, [index]: false }));
            }, 1500);
        } catch (error) {
            console.error({ error });
        }
    };

    return (
        <MainModal title="History" openModal={openModal} onClose={onClose}>
            <TableContainer component={Paper} sx={tableContainerStyles}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Address</TableCell>
                            <TableCell>Commited ({fundTokenSymbol})</TableCell>
                            <TableCell>Commitment Ratio</TableCell>
                            <TableCell>Allocation ({launchpadTokenSymbol})</TableCell>
                            <TableCell>Allocation Ratio</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userInfo &&
                            userInfo.slice(startIndex, endIndex).map((x, idx) => {
                                const userInvestedAmount = +formatUnits(
                                    x?.[0] ?? 0n,
                                    fundTokenDecimals ?? 18,
                                );
                                const userAllocationAmount = +formatUnits(
                                    x?.[2] ?? 0n,
                                    launchpadTokenDecimals ?? 18,
                                );
                                const commitmentRatio =
                                    (userInvestedAmount / totalInvestedAmount) * 100;
                                const allocationRatio =
                                    (calculateTokenAmount(userAllocationAmount, sellRateNum) /
                                        totalAllocatedAmountBNB) *
                                    100;

                                return (
                                    <TableRow key={idx}>
                                        <TableCell>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                }}
                                            >
                                                {shortenAddress(users[idx + startIndex], 8)}
                                                <Tooltip
                                                    placement="top"
                                                    PopperProps={{
                                                        disablePortal: true,
                                                    }}
                                                    open={open[idx] ?? false}
                                                    disableFocusListener
                                                    disableHoverListener
                                                    disableTouchListener
                                                    title="copied"
                                                >
                                                    <Box
                                                        onClick={() =>
                                                            handleCopy(
                                                                users[idx + startIndex],
                                                                idx + startIndex,
                                                            )
                                                        }
                                                        sx={{ cursor: 'pointer' }}
                                                    >
                                                        <CopyIcon />
                                                    </Box>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{userInvestedAmount ?? 0}</TableCell>
                                        <TableCell>{commitmentRatio ?? 0}%</TableCell>
                                        <TableCell>
                                            {userAllocationAmount}
                                            {/* (
                                            {calculateTokenAmount(
                                                userAllocationAmount,
                                                sellRateNum,
                                            ) ?? 0}{' '}
                                            {fundTokenSymbol}) */}
                                        </TableCell>
                                        <TableCell>
                                            {isNaN(allocationRatio) ? 0 : allocationRatio}%
                                        </TableCell>
                                    </TableRow>
                                );
                            })}

                        {!isDataAvailable && (
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <NoData msg="No data" />
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}

                        <TablePagination
                            colspan={5}
                            count={Math.ceil((users?.length || 1) / itemsPerPage)}
                            onChange={(_, page) => {
                                setCurrentPage(page);
                            }}
                        />
                    </TableBody>
                </Table>
            </TableContainer>
            {/* <Box sx={{ display: 'flex', justifyContent: 'center' }} mt={2}>
                <AppPagination
                    count={Math.ceil((users?.length || 1) / itemsPerPage)}
                    onChange={(_, page) => {
                        setCurrentPage(page);
                    }}
                />
            </Box> */}
        </MainModal>
    );
};
export default HistoryModal;
