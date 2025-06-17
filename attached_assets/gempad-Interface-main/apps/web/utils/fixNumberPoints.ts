export const fixNumberPoints = (num: number, points: number) => {
    return num % 1 !== 0 ? num.toFixed(points) : num;
};
