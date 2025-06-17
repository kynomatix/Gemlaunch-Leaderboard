interface Props {
    totalAmount: number;
    TGEPercent: number;
    cyclePercent: number;
    unlockTime: number;
    intervalTime: number;
}

export interface VestingSchedule {
    amount: number;
    percentage: number;
    unlockTime: number;
}
/**
 * this function is responsible for calculating the
 * @param totalAmount
 *
 * @param TGEPercentage
 *
 * @param cyclePercentage
 *
 * @param unlockTime
 *
 * @param intervalTime
 *
 * @returns
 */
export function calculateVesting({
    totalAmount,
    TGEPercent,
    cyclePercent,
    unlockTime,
    intervalTime,
}: Props) {
    if (!totalAmount || !TGEPercent || !cyclePercent || !unlockTime || !intervalTime) return null;

    const TGEAmount = (totalAmount * TGEPercent) / 100;
    const amountAfterTGE = totalAmount - TGEAmount;
    const cycleShare = (totalAmount * cyclePercent) / 100;

    const totalInterval = Math.ceil(amountAfterTGE / cycleShare);

    const vestingSchedule: VestingSchedule[] = [];
    vestingSchedule.push({ amount: TGEAmount, percentage: TGEPercent, unlockTime });

    let remainingAmount = amountAfterTGE;

    for (let i = 0; i < totalInterval; i++) {
        const currentCycleAmount = remainingAmount >= cycleShare ? cycleShare : remainingAmount;
        const currentCyclePercentage = (currentCycleAmount * 100) / totalAmount;

        vestingSchedule.push({
            amount: currentCycleAmount,
            percentage: currentCyclePercentage,
            // eslint-disable-next-line no-param-reassign
            unlockTime: (unlockTime += intervalTime),
        });

        remainingAmount -= currentCycleAmount;
    }

    return vestingSchedule;
}
