interface Props {
    totalAmount: number;
    TGEPercent: number;
    cyclePercent: number;

    intervalTime: number;
}

export function calculateVestingCycle({
    totalAmount,
    TGEPercent,
    cyclePercent,
    intervalTime,
}: Props) {
    if (!totalAmount || !TGEPercent || !cyclePercent || !intervalTime) return null;

    const TGEAmount = (totalAmount * TGEPercent) / 100;
    const amountAfterTGE = totalAmount - TGEAmount;
    const cycleShare = (totalAmount * cyclePercent) / 100;

    const totalInterval = Math.ceil(amountAfterTGE / cycleShare);

    // const vestingSchedule: VestingSchedule[] = [];
    // vestingSchedule.push({ amount: TGEAmount, percentage: TGEPercent, unlockTime });

    // let remainingAmount = amountAfterTGE;

    // for (let i = 0; i < totalInterval; i++) {

    //   const currentCycleAmount = remainingAmount >= cycleShare ? cycleShare : remainingAmount;
    //   const currentCyclePercentage = (currentCycleAmount * 100) / totalAmount;

    //   vestingSchedule.push({
    //     amount: currentCycleAmount,
    //     percentage: currentCyclePercentage,
    //     // eslint-disable-next-line no-param-reassign
    //     unlockTime: (unlockTime += intervalTime),
    //   });

    //   remainingAmount -= currentCycleAmount;
    return totalInterval;
}
