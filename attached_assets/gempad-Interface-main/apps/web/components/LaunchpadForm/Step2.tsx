import React, { Dispatch } from 'react';
import Step2Launchpad from './Step2Launchpad';
import Step2FairLaunch from './Step2FairLaunch';
import Step2DutchAuction from './Step2DutchAuction';
import Step2Subscription from './Step2Subscription';
import { usePathname } from 'next/navigation';
import { SetStateAction } from 'jotai';
import { useFormContext } from 'react-hook-form';
import { TokenDetails } from '@/hooks/useTokenDetails';

interface Step2Props {
    setIsBalanceEnough: Dispatch<SetStateAction<boolean>>;
    tokenNeedToCreateLaunchpad: number;
    tokenNeedToCreateDutchAuction: number;
    tokenDetails: TokenDetails[];
    feePercentNum: number;
}

const Step2 = ({
    setIsBalanceEnough,
    tokenNeedToCreateLaunchpad,
    tokenDetails,
    tokenNeedToCreateDutchAuction,
    feePercentNum,
}: Step2Props) => {
    const { register } = useFormContext();
    const pathname = usePathname();

    return (
        <div>
            {/* // tricky hack to bypass the bug in react-hook-form */}
            {/* // https://github.com/react-hook-form/react-hook-form/issues/2755 */}
            <input
                type="hidden"
                {...register('step2', {
                    shouldUnregister: true,
                })}
            />
            {pathname === '/create-launchpad' && (
                <Step2Launchpad
                    feePercentNum={feePercentNum}
                    setIsBalanceEnough={setIsBalanceEnough}
                    tokenNeedToCreateLaunchpad={tokenNeedToCreateLaunchpad}
                />
            )}
            {pathname === '/create-fair-launch' && (
                <Step2FairLaunch
                    setIsBalanceEnough={setIsBalanceEnough}
                    feePercentNum={feePercentNum}
                />
            )}
            {pathname === '/create-dutch-auction' && (
                <Step2DutchAuction
                    setIsBalanceEnough={setIsBalanceEnough}
                    tokenDetails={tokenDetails}
                    feePercentNum={feePercentNum}
                />
            )}
            {pathname === '/create-subscription' && (
                <Step2Subscription
                    setIsBalanceEnough={setIsBalanceEnough}
                    feePercentNum={feePercentNum}
                />
            )}
        </div>
    );
};

export default Step2;
