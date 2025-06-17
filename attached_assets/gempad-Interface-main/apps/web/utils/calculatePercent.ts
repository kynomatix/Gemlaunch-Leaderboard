export const calculatePercentage = (number: number, percent: number): number => {
    if (isNaN(number) || isNaN(percent)) {
        return 0;
    }
    // Calculate the percentage of the number
    const result = (percent / 100) * number;

    return result;
};
