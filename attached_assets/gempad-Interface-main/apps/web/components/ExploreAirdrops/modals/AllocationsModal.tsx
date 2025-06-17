import * as React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import MainModal from '../../Modals';
import { allocationsModalDefaultValues, allocationsPlaceholder } from '../constants';
import { AllocationsModalFormInput, ModalProps, Tx } from '../types';
import { allocationsModalValidation } from '../validations';
import { useAirdropContract } from '@/hooks/useContract';
import ButtonLoader from '@/components/ButtonLoader/ButtonLoader';
import { Address, formatEther, parseUnits } from 'viem';
import { DefaultGasLimit } from '@/constants';
import { waitForTransaction } from 'wagmi/actions';
import { useNetwork } from 'wagmi';
import { useToken } from '@/hooks/Tokens';
import { TransactionTrackingContext } from '@/components/Provider/TransactionTrackingProvider';
import toast from 'react-hot-toast';
import DescriptionWithTx from '@/components/Toast/DescriptionWithTx';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import * as yup from 'yup';
import papa, { ParseResult } from 'papaparse';
import { isEmpty, omitBy } from 'lodash';
import { isValidAddress } from '@/utils/format';
import { handleMergeDuplicates, handleRemoveDuplicates } from '@/utils/allocations';

const csvColumns = ['address', 'amount'];

interface TokenAddress {
    address: Address;
    amount: bigint;
}

const uniqueValidation = (objects: TokenAddress[]) => {
    const walletAddresses = new Set();

    for (const obj of objects) {
        if (obj.address) {
            if (walletAddresses.has(obj.address.toLowerCase())) {
                return false;
            }
            walletAddresses.add(obj.address.toLowerCase());
        }
    }
    return true;
};

export function csvRowValidation() {
    return yup.object().shape({
        address: yup
            .string()
            .required()
            .test('isValidAddress', 'address is not valid', (v) =>
                v ? isValidAddress(v?.toLowerCase()) : true,
            ),
        amount: yup.number().required(),
    });
}

const AllocationsModal = (props: ModalProps) => {
    const [isDuplicateAddresses, setIsDuplicateAddresses] = React.useState<boolean>(false);
    const { contractAddress, handleClose, open, tokenAddress } = props;
    const contract = useAirdropContract(contractAddress);

    const TOKEN = useToken(tokenAddress);

    const [tx, setTx] = React.useState<Tx>(Tx.IDLE);

    const { chainId } = useActiveChainId();

    const {
        handleSubmit,
        control,
        setValue,
        trigger,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<AllocationsModalFormInput>({
        mode: 'onChange',
        defaultValues: allocationsModalDefaultValues,
        resolver: yupResolver(allocationsModalValidation) as any,
    });
    const allocations = watch('allocations');

    const { addTransaction } = React.useContext(TransactionTrackingContext);

    const onSubmit: SubmitHandler<AllocationsModalFormInput> = async (
        data: AllocationsModalFormInput,
    ) => {
        try {
            setTx(Tx.PENDING);
            const { allocations } = data;
            let addresses: Address[] = [];
            let amounts: bigint[] = [];

            const lines = allocations.trim().split('\n');

            lines.forEach((line) => {
                const [address, amount] = line.split(',');
                addresses.push(address as Address);
                amounts.push(parseUnits(amount, TOKEN?.decimals));
            });

            const estimatedGas = await contract.estimateGas.addParticipantsAndAllocation(
                [addresses, amounts],
                {} as never,
            );
            const hash = await contract.write.addParticipantsAndAllocation([addresses, amounts], {
                gas: estimatedGas || DefaultGasLimit,
            });

            addTransaction({ hash, type: 'participants-added' });
            setTx(Tx.PROCESSING);
            await waitForTransaction({ hash, chainId });
            toast.success(
                <DescriptionWithTx
                    title="Success"
                    description="Allocations added!"
                    txHash={hash}
                    txChainId={chainId}
                />,
            );
            handleClose();
        } catch (e: any) {
            console.error(e);
            toast.error(
                <DescriptionWithTx
                    title={e?.errorName ?? 'Error'}
                    description={e?.shortMessage ?? 'Something went wrong!'}
                />,
            );
        } finally {
            setTx(Tx.IDLE);
        }
    };

    const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <MainModal title="Add Allocations" openModal={open} onClose={handleClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ mb: '16px' }}>
                    <Typography variant="h5" color="common.white" ml={2}>
                        Users Allocations <span style={{ color: '#FF8484' }}>*</span>
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
                                placeholder={allocationsPlaceholder}
                                margin="normal"
                                error={!!errors?.allocations}
                                InputProps={{
                                    style: { fontSize: '12px' }, // Adjust the font size as needed
                                }}
                                helperText={
                                    <Typography variant="body2">
                                        {errors?.allocations?.message.toString() || ''}
                                    </Typography>
                                }
                            />
                        )}
                    />
                </Box>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                        gap: 1,
                    }}
                >
                    <Button
                        type="submit"
                        variant="contained"
                        size="small"
                        disabled={isSubmitting}
                        sx={{ width: { xs: '100%', md: 'auto' } }}
                    >
                        {tx === Tx.IDLE && 'Add'}
                        {tx === Tx.PENDING && <ButtonLoader text="Pending" />}
                        {tx === Tx.PROCESSING && <ButtonLoader text="Processing" />}
                    </Button>
                    <Button
                        component={'label'}
                        variant="contained"
                        size="small"
                        sx={{ px: '16px' }}
                    >
                        Upload CSV
                        <input type="file" onChange={handleImportCSV} hidden />
                    </Button>
                </Box>

                {isDuplicateAddresses && (
                    <Box
                        sx={{
                            mt: 1,
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                            gap: 1,
                        }}
                    >
                        <Button
                            variant="contained"
                            size="small"
                            sx={{ px: '16px' }}
                            onClick={() =>
                                setValue('allocations', handleMergeDuplicates(allocations), {
                                    shouldValidate: true,
                                })
                            }
                        >
                            Merge Duplicates
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{ px: '16px' }}
                            onClick={() =>
                                setValue('allocations', handleRemoveDuplicates(allocations), {
                                    shouldValidate: true,
                                })
                            }
                        >
                            Remove Duplicates
                        </Button>
                    </Box>
                )}
            </form>
        </MainModal>
    );
};

export default AllocationsModal;
