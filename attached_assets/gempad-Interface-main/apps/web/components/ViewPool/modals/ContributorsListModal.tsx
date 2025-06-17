import AppPagination from '@/components/AppPagination/AppPagination';
import MainModal from '@/components/Modals';
import { useSubscriptionContract } from '@/hooks/useContract';
import { useSingleCallResult, useSingleContractMultipleData } from '@/state/multicall/hooks';
import {
    Box,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material';
import React from 'react';
import { Address, formatUnits } from 'viem';
import { ModalProps } from '../types';
import useSubscriptionDetails from '../hooks/subscriptionHoosk/useSubscriptionDetails';
import useFundTokenDetails from '../hooks/useFundTokenDetails';
import { shortenAddress } from '@/utils/format';
import CopyIcon from 'public/assets/icons/copy.svg';
import { tableContainerStyles } from '../constant';
import NoData from '@/components/NoData/NoData';
import TablePagination from '@/components/TablePagination/TablePagination';

const ContributorsListModal: React.FC<ModalProps> = ({
    open: openModal,
    handleClose,
    contractAddress,
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

    const subscPoolContract = useSubscriptionContract(contractAddress as Address);
    const { allInvestors: users } = useSubscriptionDetails(contractAddress);
    const { fundTokenSymbol, fundTokenDecimals } = useFundTokenDetails(contractAddress);

    const response = useSingleContractMultipleData({
        contract: {
            abi: subscPoolContract.abi,
            address: subscPoolContract.address,
        },
        functionName: 'userInfo',
        args: users ? users.map((x) => [x] as [`0x${string}`]) : [],
    });

    const userInfo = response?.map((x) => x.result);
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
        <MainModal title="Contributors" openModal={openModal} onClose={handleClose}>
            <TableContainer component={Paper} sx={tableContainerStyles}>
                <Table sx={{ minWidth: 400 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Address</TableCell>
                            <TableCell>Amount ({fundTokenSymbol})</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userInfo &&
                            userInfo.slice(startIndex, endIndex).map((x, idx) => {
                                // console.log({abc: x?.[0]?.[startIndex]})
                                const userInvestedAmount = +formatUnits(
                                    x?.[0] ?? 0n,
                                    fundTokenDecimals ?? 18,
                                );

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
                            colspan={2}
                            count={Math.ceil((users?.length || 1) / itemsPerPage)}
                            onChange={(_, page) => {
                                setCurrentPage(page);
                            }}
                        />
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center' }} mt={2}>
                {/* <AppPagination
                    count={Math.ceil((users?.length || 1) / itemsPerPage)}
                    onChange={(_, page) => {
                        setCurrentPage(page);
                    }}
                /> */}
            </Box>
        </MainModal>
    );
};

export default ContributorsListModal;
