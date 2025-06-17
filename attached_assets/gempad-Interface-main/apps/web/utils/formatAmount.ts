import numbro from 'numbro';

export const formatAmount = (number: number | string, digits = 2) => {
    const num = Number(number);

    if (num <= 0) return '0';

    if (!num) return '0';

    if (num < 0.001) return '<0.001';

    return numbro(num)
        .format({
            thousandSeparated: true,
            average: true,
            mantissa: num > 1000 ? 2 : digits,
            abbreviations: {
                million: 'M',
                billion: 'B',
                trillion: 'T',
            },
        })
        .toUpperCase();
};

//  alternative: https://github.com/Synthetixio/v3-markets-prototype/blob/67f8682de60b4454023fcce9e52511b7962b2fa2/src/utils/currency.ts
