export const getProgress = (cur: number, tot: number): number => {
    if (cur <= 0 || tot <= 0) return 0;

    const progress = (cur / tot) * 100;
    return Math.min(progress, 100); // Ensure progress doesn't exceed 100%
};
