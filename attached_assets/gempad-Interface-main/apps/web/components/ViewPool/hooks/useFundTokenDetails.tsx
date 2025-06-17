import { LaunchpadABI } from '@/config/abi/launchpad';
import { useAccount, useBalance, useContractRead } from 'wagmi';
import useTokenInformation from '@/hooks/useTokenInformation';
import { Address, formatUnits, zeroAddress } from 'viem';
import { NATIVE_CURRENCY_NAME, NATIVE_CURRENCY_SYMBOLS } from '@/constants';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { activeListeningKeys } from '@/state/multicall/updater';
import { useCurrency } from '@/hooks/Tokens';

const useFundTokenDetails = (launchpadAddress: Address) => {
    const {
        data: fundTokenAddress,
        isError,
        isLoading,
    } = useContractRead({
        abi: LaunchpadABI,
        functionName: 'fundToken',
        address: launchpadAddress,
        watch: true,
    });

    const { chainId } = useActiveChainId();
    // const { address } = useAccount();

    const fundTokenDetails = useTokenInformation(fundTokenAddress);

    const tokenBalance = fundTokenDetails.balance;

    let fundTokenDecimals = 18;
    let fundTokenSymbol = NATIVE_CURRENCY_SYMBOLS[chainId];
    let fundTokenName = NATIVE_CURRENCY_NAME[chainId];
    let isNative = true;
    let balance = tokenBalance;

    if (fundTokenAddress !== zeroAddress) {
        fundTokenDecimals = fundTokenDetails.decimals;
        fundTokenSymbol = fundTokenDetails.symbol;
        fundTokenName = fundTokenDetails.name;
        isNative = false;
        balance = tokenBalance;
    }

    return {
        fundTokenDecimals,
        fundTokenSymbol,
        fundTokenName,
        isNative,
        fundTokenAddress,
        balance,
        isLoading,
    };
};

export default useFundTokenDetails;
