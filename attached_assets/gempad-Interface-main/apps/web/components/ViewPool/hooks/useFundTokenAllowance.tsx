import { useToken } from '@/hooks/Tokens';
import { ApprovalState, useApproveCallback } from '@/hooks/useApproveCallback';
import { Currency, CurrencyAmount } from '@dapp/swap-sdk-core';
import tryParseAmount from '@dapp/utils/tryParseAmount';
import React, { useCallback } from 'react';
import { Address, formatUnits, parseUnits } from 'viem';
import { SendTransactionResult } from 'wagmi/actions';

interface IFundTokenAllowance {
    fundTokenAddress: Address;
    buyAmount: number;
    fundTokenDecimals: number;
    launchpadAddress: Address;
}

interface IFundTokenResult {
    approvalState: ApprovalState;
    approveCallback: (exactAmount?: bigint) => Promise<SendTransactionResult>;
    revokeCallback: () => Promise<SendTransactionResult>;
    currentAllowance: CurrencyAmount<Currency> | undefined;
    approveExactAmount: () => Promise<SendTransactionResult>;
    isPendingError: boolean;
    hasAllowance: boolean;
    isZeroAllowance: boolean;
    hasLessAllowance: boolean;
}

const useFundTokenAllowance = ({
    fundTokenAddress,
    buyAmount,
    fundTokenDecimals,
    launchpadAddress,
}: IFundTokenAllowance): IFundTokenResult => {
    const amountToString = buyAmount.toString();
    const buyAmountBigInt = parseUnits(amountToString, fundTokenDecimals);

    const tokenCurrency = useToken(fundTokenAddress);
    const amountToApprove = tryParseAmount(
        formatUnits(buyAmountBigInt, fundTokenDecimals || 18),
        tokenCurrency,
    );

    const { approvalState, approveCallback, currentAllowance, isPendingError, revokeCallback } =
        useApproveCallback(amountToApprove, launchpadAddress);

    const hasAllowance =
        !currentAllowance?.equalTo(0) && !currentAllowance?.lessThan(amountToApprove);
    const isZeroAllowance = currentAllowance?.equalTo(0);
    const hasLessAllowance = currentAllowance?.lessThan(amountToApprove);

    const approveExactAmount = useCallback(
        () => approveCallback(buyAmountBigInt),
        [buyAmountBigInt],
    );

    return {
        approvalState,
        approveCallback,
        currentAllowance,
        isPendingError,
        revokeCallback,
        isZeroAllowance,
        hasAllowance,
        hasLessAllowance,
        approveExactAmount,
    };
};

export default useFundTokenAllowance;
