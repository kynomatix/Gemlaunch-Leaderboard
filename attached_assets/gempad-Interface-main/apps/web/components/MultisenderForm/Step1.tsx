import React, { ChangeEvent } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from '@mui/material';
import papa, { ParseResult } from 'papaparse';
import isEmpty from 'lodash/isEmpty';
import omitBy from 'lodash/omitBy';

import { Address, formatEther, formatUnits, parseEther, parseUnits } from 'viem';
import { Controller, useFormContext } from 'react-hook-form';
import { csvRowValidation } from './csvRowValidation';
import { useMulticallContract, useTokenContract } from '@/hooks/useContract';
import { useSingleCallResult, useSingleContractMultipleData } from '@/state/multicall/hooks';
import { useContractReads, useNetwork, useToken } from 'wagmi';
import PrimaryCard from '../Cards/PrimaryCard';
import { isValidAddress } from '@/utils/format';
import { ApprovalState, useApproveCallback } from '@/hooks/useApproveCallback';
import tryParseAmount from '@dapp/utils/tryParseAmount';
// import { useToken } from '@/hooks/Tokens';

import toast from 'react-hot-toast';
import DescriptionWithTx from '../Toast/DescriptionWithTx';
import { uniqueValidation } from './validations';
import { AmountToApprove, MultisenderFormInput, Step1Props, TokenAddress } from './types';
import { csvColumns, multilinePlaceholder } from './constants';
import Infobar from '../Infobar/Infobar';
import { MULTISENDER_CONTRACT_ADDRESSES } from '@/constants';

import CodeMirror from '@uiw/react-codemirror';
import { consoleDark } from '@uiw/codemirror-theme-console';
import { tags as t } from '@lezer/highlight';
import { createTheme } from '@uiw/codemirror-themes';
import { handleMergeDuplicates, handleRemoveDuplicates } from '@/utils/allocations';
import { useActiveChainId } from '@/hooks/useActiveChainId';

const Step1 = ({
    totalTransferableAmount,
    approvalState,
    approveAmount,
    tokenDecimals,
}: Step1Props) => {
    const [isDuplicateAddresses, setIsDuplicateAddresses] = React.useState<boolean>(false);
    const { chainId } = useActiveChainId();

    const {
        control,
        setValue,
        watch,
        trigger,
        formState: { errors },
    } = useFormContext<MultisenderFormInput>();
    const tokenAddress = watch('tokenAddress');
    const allocations = watch('allocations');

    const { data, isLoading: isTokenLoading } = useToken({
        address: tokenAddress as Address,
    });

    const tokensInfo = [
        { id: 1, prop: 'name', val: data?.name },
        { id: 2, prop: 'symbol', val: data?.symbol },
        { id: 3, prop: 'decimals', val: data?.decimals },
        { id: 4, prop: 'totalSupply', val: data?.totalSupply?.formatted },
    ];

    const handleImportCSV = async (e: ChangeEvent<HTMLInputElement>) => {
        try {
            // check if the file exists or not
            const file = e.currentTarget?.files?.[0];
            if (!file) {
                toast.error(<DescriptionWithTx title="Error" description="Can't read file" />);
                return;
            }

            // Allowed formats
            const csvFormats = [
                'text/comma-separated-values',
                'text/csv',
                'application/csv',
                'application/excel',
                'application/vnd.ms-excel',
                'application/vnd.msexcel',
            ];

            // check if it is in allowed methods
            if (!csvFormats.includes(file.type)) {
                toast.error(
                    <DescriptionWithTx
                        title="Error"
                        description={`${file.name} file is not in CSV format.`}
                    />,
                );
                return;
            }

            const csvText = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.readAsText(file);
                reader.onload = () => {
                    resolve(reader.result as string); // base64 Image src
                };
            });

            const parseResult = await new Promise<ParseResult<TokenAddress>>((resolve) => {
                papa.parse<TokenAddress>(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    worker: true,
                    complete: (result: any) => {
                        resolve(result);
                    },
                    error: (error: Error) => {
                        toast.error(
                            <DescriptionWithTx
                                title="Error"
                                description={`error when parsing: ${error}`}
                            />,
                        );
                    },
                });
            });

            const parseEntities = parseResult.data.filter(
                (x: TokenAddress) => !isEmpty(omitBy(x, (x) => isEmpty(x))),
            );
            const parseColumns = parseResult.meta.fields;
            const parseErrors = parseResult.errors.map(
                (x: any) => `${x.type} (${x.code}): row: ${x.row}, ${x.message}`,
            );

            // papa parse validation
            if (parseErrors.length) {
                parseErrors.forEach((x: any) =>
                    toast.error(<DescriptionWithTx title="Error" description={x} />),
                );
                return;
            }

            // empty data validation
            if (isEmpty(parseEntities)) {
                toast.error(
                    <DescriptionWithTx title="Error" description="No data found in CSV file" />,
                );
                return;
            }

            // header validation
            for (const [index, column] of csvColumns.entries()) {
                if (!parseColumns?.includes(column)) {
                    toast.error(
                        <DescriptionWithTx
                            title="Error"
                            description={`Column '${column}' is not correct or missing. Make sure to follow the sample template.`}
                        />,
                    );

                    if (index + 1 === csvColumns.length) return;
                }
            }

            // unique address validation
            const isUniqueWalletAddress = uniqueValidation(parseEntities);
            if (!isUniqueWalletAddress) {
                toast.error(
                    <DescriptionWithTx
                        title="Error"
                        description="You can not upload duplicate wallet addresses."
                    />,
                );
                return;
            }

            // typecasting the data where needed
            const parseData = parseEntities.map((x: TokenAddress) => {
                if (x.amount) x.amount = parseUnits(x.amount.toString(), 18);
                return x;
            });

            const validation = csvRowValidation();
            parseData.map((entity) => {
                try {
                    validation.validateSync(entity, { abortEarly: false });
                } catch (error) {
                    toast.error(
                        <DescriptionWithTx
                            title="Error"
                            description="There are issues with your upload make sure to follow the template"
                        />,
                    );

                    throw new Error();
                }
            });

            const addressesAndAmounts = parseData
                .map((item) => `${item.address},${formatEther(item.amount)}`)
                .join('\n');
            setValue('allocations', addressesAndAmounts);
            trigger();
        } catch (error: any) {
            console.error({ error });
            toast.error(
                <DescriptionWithTx
                    title={error.name || 'Error'}
                    description={error.shortMessage || 'Something went wrong'}
                />,
            );
        }
    };

    React.useEffect(() => {
        if (!allocations) return;

        const lines = allocations.trim().split('\n');
        const addresses = new Set<string>();

        let isDuplicateAddresses = false;

        for (const line of lines) {
            const [addr, amount] = line?.split(',');
            const amountNumber = +amount?.trim();

            // Check if both address and amount are present and amount is a valid number
            if (addr && amount && !isNaN(amountNumber)) {
                // Process the address and amount here if needed
                // For now, we are just checking for duplicate addresses
                if (addresses.has(addr)) {
                    isDuplicateAddresses = true;
                    break;
                }
                addresses.add(addr);
            }
        }

        setIsDuplicateAddresses(isDuplicateAddresses);
    }, [allocations]);

    return (
        <Box>
            <Box sx={{ mb: '16px' }}>
                <Typography variant="h5" ml={2} sx={{ mb: '9px' }}>
                    Token Address
                </Typography>

                <Controller
                    name="tokenAddress"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            type="text"
                            value={field.value || ''}
                            fullWidth
                            placeholder="Enter token or LP token address"
                            error={!!errors?.tokenAddress}
                            helperText={
                                <>
                                    <Typography variant="body2">
                                        {errors?.tokenAddress?.message.toString() || ''}
                                    </Typography>
                                    <Typography color="primary" variant="body1" fontSize={11}>
                                        Gemlaunch Multi-sender allows you to send ERC20 token in
                                        batch by easiest way. You can enter token address to send
                                        specific token or leave it blank to send chain token such as
                                        ETH....
                                    </Typography>
                                </>
                            }
                        />
                    )}
                />
            </Box>

            <Box>
                {isTokenLoading && (
                    <PrimaryCard mt={10} mb={10}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                            }}
                        >
                            <CircularProgress size={16} />
                            <Typography>Fetching...</Typography>
                        </Box>
                    </PrimaryCard>
                )}

                {data && (
                    <PrimaryCard mt={10} mb={10}>
                        {tokensInfo.map(({ id, prop, val }) => (
                            <Box
                                key={id}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '10px',
                                    flexWrap: 'wrap',
                                    my: 1,
                                }}
                            >
                                <Typography variant="body1" fontSize={14}>
                                    {prop}
                                </Typography>
                                <Typography variant="body1" fontSize={14}>
                                    {String(val)}
                                </Typography>
                            </Box>
                        ))}
                    </PrimaryCard>
                )}
            </Box>

            {/* *** ALLOCATIONS *** */}
            <Box sx={{ mb: '16px' }}>
                <Typography variant="h5" ml={2}>
                    Allocations <span style={{ color: '#FF8484' }}>*</span>
                </Typography>

                <Controller
                    name="allocations"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            type="text"
                            value={field.value || ''}
                            fullWidth
                            multiline
                            rows={8}
                            placeholder={multilinePlaceholder}
                            margin="normal"
                            error={!!errors?.allocations}
                            helperText={
                                <Typography variant="body2">
                                    {errors?.allocations?.message.toString() || ''}
                                </Typography>
                            }
                        />
                    )}
                />

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        mt: '10px',
                        ml: '10px',
                        flexDirection: { xs: 'column', sm: 'row' },
                    }}
                >
                    <Button
                        component={'label'}
                        variant="contained"
                        size="small"
                        sx={{ px: '16px' }}
                    >
                        Or choose from CSV file
                        <input type="file" onChange={handleImportCSV} hidden />
                    </Button>

                    {isDuplicateAddresses && (
                        <>
                            <Button
                                variant="contained"
                                onClick={() =>
                                    setValue('allocations', handleMergeDuplicates(allocations), {
                                        shouldValidate: true,
                                    })
                                }
                                size="small"
                                sx={{ px: '16px' }}
                            >
                                Merge Duplicates
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() =>
                                    setValue('allocations', handleRemoveDuplicates(allocations), {
                                        shouldValidate: true,
                                    })
                                }
                                size="small"
                                sx={{ px: '16px' }}
                            >
                                Remove Duplicates
                            </Button>
                        </>
                    )}

                    {/* <Button
                        variant="text"
                        size="small"
                        sx={{ px: '16px', width: { xs: '100%', sm: 'auto' } }}
                    >
                        Sample CSV file
                    </Button> */}
                </Box>
            </Box>

            {/* *** AMOUNT TO APPROVE */}
            {(approvalState === ApprovalState.NOT_APPROVED ||
                approvalState === ApprovalState.PENDING) && (
                <FormControl sx={{ mt: '20px' }}>
                    <FormLabel id="amount">
                        <Typography color="common.white" variant="h5">
                            Amount to approve
                        </Typography>
                    </FormLabel>
                    <Controller
                        name="amountToApprove"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup {...field} defaultValue={AmountToApprove.UNLIMITED}>
                                <FormControlLabel
                                    value={AmountToApprove.UNLIMITED}
                                    control={<Radio sx={{ color: '#fff' }} />}
                                    label="Unlimited Amount"
                                />
                                <FormControlLabel
                                    value={AmountToApprove.EXACT}
                                    control={<Radio sx={{ color: '#fff' }} />}
                                    label={`Exact Amount (${
                                        formatUnits(approveAmount, tokenDecimals) || 0
                                    })`}
                                />
                            </RadioGroup>
                        )}
                    />
                </FormControl>
            )}

            <Box>
                <Infobar
                    dismissable={false}
                    open={true}
                    variant="warning"
                    message={`Please exclude ${MULTISENDER_CONTRACT_ADDRESSES[chainId]} from fee, rewards and max tx amount to start sending tokens`}
                />
            </Box>
        </Box>
    );
};

export default Step1;
