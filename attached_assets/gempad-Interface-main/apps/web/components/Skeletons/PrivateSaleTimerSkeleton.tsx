import React from 'react';
import { Box, Button, InputAdornment, Skeleton, TextField, Typography } from '@mui/material';
import PrimaryCard from '../Cards/PrimaryCard';

const PrivateSaleTimerSkeleton: React.FC = () => {
    return (
        <PrimaryCard py={25}>
            <Box sx={{ width: '100%', height: '100%' }}>
                <Box sx={{ paddingX: '25px' }}>
                    <Skeleton animation="wave" variant="rounded" width="100%" height={30}>
                        <Typography>Upcoming</Typography>
                    </Skeleton>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '15px',
                        marginTop: '15px',
                        marginBottom: '8px',
                        paddingX: '25px',
                    }}
                >
                    <Typography sx={{ display: 'flex', gap: '20px' }}>
                        <Skeleton animation="wave" variant="text">
                            <Typography
                                sx={{ width: '45px', height: '70px', borderRadius: '30px' }}
                            >
                                Timer
                            </Typography>
                        </Skeleton>
                        <Skeleton animation="wave" variant="text">
                            <Typography
                                sx={{ width: '45px', height: '44px', borderRadius: '30px' }}
                            >
                                Timer
                            </Typography>
                        </Skeleton>
                        <Skeleton animation="wave" variant="text">
                            <Typography
                                sx={{ width: '45px', height: '44px', borderRadius: '30px' }}
                            >
                                Timer
                            </Typography>
                        </Skeleton>
                        <Skeleton animation="wave" variant="text">
                            <Typography
                                sx={{ width: '45px', height: '44px', borderRadius: '30px' }}
                            >
                                Timer
                            </Typography>
                        </Skeleton>
                    </Typography>
                </Box>

                <Box sx={{ mt: '16px', mb: '30px' }}>
                    <Skeleton animation="wave" variant="rounded" width="100%" height={10}>
                        <Typography>Upcoming</Typography>
                    </Skeleton>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '6px',
                            mt: '6px',
                            flexWrap: 'wrap',
                        }}
                    >
                        {/* <Typography fontSize={10} variant="body1"> */}
                        <Skeleton
                            animation="wave"
                            variant="rounded"
                            height={8}
                            width={34}
                            sx={{ borderRadius: '10px' }}
                        />
                        <Skeleton
                            animation="wave"
                            variant="rounded"
                            height={8}
                            width={34}
                            sx={{ borderRadius: '10px' }}
                        />
                        {/* <Typography>Upco</Typography> */}
                        {/* </Skeleton> */}
                        {/* </Typography> */}
                        {/* <Typography fontSize={10} variant="body1">
                            <Skeleton animation="wave" variant='rounded' sx={{borderRadius : "10px"}}>
                                <Typography>Upcoming</Typography>
                            </Skeleton>
                        </Typography> */}
                    </Box>
                </Box>
                <Box width="100%" height="11rem">
                    <Skeleton
                        animation="wave"
                        variant="rectangular"
                        width="100%"
                        height="11rem"
                        sx={{ borderRadius: '15px' }}
                    >
                        <Typography>Upcoming</Typography>
                    </Skeleton>
                </Box>
            </Box>

            {/* <Box>
                {status === 1 && (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextFieldHead title={`Max Amount (${maxContributionLimit})`} />
                        <Controller
                            name="amount"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    type="number"
                                    placeholder="Amount"
                                    onScroll={disableScroll}
                                    error={!!errors?.amount}
                                    helperText={<TextFieldError fieldName={errors?.amount} />}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="start">
                                                <Button
                                                    onClick={handleMax}
                                                    variant="text"
                                                    size="small"
                                                    sx={{ px: '16px' }}
                                                >
                                                    MAX
                                                </Button>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        />

                        {currency !== ADDRESS_ZERO ? (
                            <>
                                {approvalState === ApprovalState.APPROVED && (
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        size="small"
                                        disabled={isSubmitting || isAllTokensSold || status !== 1}
                                        sx={{ width: '100%', mt: 1 }}
                                    >
                                        {isIdle && `Buy with ${tokenSymbol}`}
                                        {isPending && <ButtonLoader text="Pending" />}
                                        {isProcessing && <ButtonLoader text="Processing" />}
                                    </Button>
                                )}
                                {approvalState !== ApprovalState.APPROVED && (
                                    <Button
                                        variant="contained"
                                        onClick={() => approveCallback()}
                                        size="small"
                                        disabled={approvalState === ApprovalState.PENDING}
                                        sx={{ width: '100%', mt: 1 }}
                                    >
                                        {isIdle && `Approve`}
                                        {isPending && <ButtonLoader text="Pending" />}
                                        {isProcessing && <ButtonLoader text="Processing" />}
                                    </Button>
                                )}
                            </>
                        ) : (
                            <Button
                                variant="contained"
                                type="submit"
                                size="small"
                                disabled={isSubmitting || isAllTokensSold || status !== 1}
                                sx={{ width: '100%', mt: 1 }}
                            >
                                {isIdle && `Buy with ${tokenSymbol}`}
                                {isPending && <ButtonLoader text="Pending" />}
                                {isProcessing && <ButtonLoader text="Processing" />}
                            </Button>
                        )}
                    </form>
                )}
                {status === 2 && (
                    <Button
                        onClick={handleClaimRefund}
                        disabled={isUserHasClaimedFund || !isIdle}
                        variant="contained"
                        size="small"
                        sx={{ width: '100%', mt: 1 }}
                    >
                        {isIdle && isUserHasClaimedFund ? 'Already Refunded' : `Claim Refund`}
                        {isPending && <ButtonLoader text="Pending" />}
                        {isProcessing && <ButtonLoader text="Processing" />}
                    </Button>
                )}
            </Box> */}
        </PrimaryCard>
    );
};

export default PrivateSaleTimerSkeleton;
