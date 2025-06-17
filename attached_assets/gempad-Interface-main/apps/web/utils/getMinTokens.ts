interface FairLaunchProps {
    totalSellingAmount: number;
    tokenFee: number;
    liquidityPercent: number;
    decimals: number;
}

interface LaunchpadProps {
    hardcap: number;
    sellPrice: number;
    listingPrice: number;
    autoListing: boolean;
    liquidityFee: number;
    feeOptions: number;
}

interface DutchAuction {
    totalSellingAmount: number;
    softcap: number;
    hardcap: number;
    feeOptions: number; // tokenFee
    liquidityFee: number;
}

interface Subscription {
    hardcap: number;
    tokenFee: number;
    listingRate: number;
    subscriptionRate: number;
    liquidityPercent: number;
}

export const getMinTokensToCreateFairLaunh = ({
    totalSellingAmount,
    tokenFee,
    liquidityPercent,
    decimals,
}: FairLaunchProps): number => {
    const fee = (totalSellingAmount * tokenFee * 1e3) / 100e3;
    const tokens =
        Number(totalSellingAmount) +
        ((totalSellingAmount - fee) * (liquidityPercent * 1e3)) / 100e3;

    const tokenToReceive = (tokens * 10 ** decimals) / 1e18;
    return tokenToReceive;
};

export const getMinTokensToCreateLaunchpad = ({
    hardcap = 0,
    sellPrice = 0,
    listingPrice = 0,
    autoListing,
    liquidityFee = 0,
    feeOptions,
}: LaunchpadProps): number => {
    const sellTokens = Number(hardcap) * Number(sellPrice);
    const fee = sellTokens * (feeOptions / 100);
    const tokenAfterFee = sellTokens - fee;
    const liquidity = (tokenAfterFee * listingPrice) / sellPrice;
    const listTokens = liquidity * (liquidityFee / 100);

    return autoListing ? sellTokens + listTokens : sellTokens;
};

export const getMinTokensToCreateDutchAuction = ({
    totalSellingAmount,
    softcap,
    hardcap,
    feeOptions, // tokenFee
    liquidityFee,
}: DutchAuction) => {
    const tsa = Number(totalSellingAmount);

    const endPrice = tsa / softcap;
    const fee = (hardcap * feeOptions) / 100e3;
    const liquidityToken = (hardcap - fee) * endPrice;
    const tokens = totalSellingAmount + (liquidityToken * liquidityFee) / 100e3;

    return tokens;
};

export const getMinTokensToCreateSubscription = ({
    hardcap,
    tokenFee,
    listingRate,
    subscriptionRate,
    liquidityPercent,
}: Subscription) => {
    // Depricated:
    // const liq = (+hardcap - tokenFee) * +listingRate / +subscriptionRate;
    // return +hardcap + (liq * +liquidityPercent * 1e3) / 100e3;

    // New:
    const fee = (+hardcap * tokenFee) / 100e3;
    const liq = ((+hardcap - fee) * +listingRate) / +subscriptionRate;
    const tokenToReceive = +hardcap + (liq * liquidityPercent * 1e3) / 100e3;
    return +tokenToReceive.toFixed(4);
};


export const getTokenForLiquidity = ({
    hardcap = 0,
    sellPrice = 0,
    listingPrice = 0,
    autoListing,
    liquidityFee = 0,
    feeOptions,
}: LaunchpadProps): number => {
    const sellTokens = Number(hardcap) * Number(sellPrice);
    const fee = sellTokens * (feeOptions / 100);
    const tokenAfterFee = sellTokens - fee;
    const liquidity = (tokenAfterFee * listingPrice) / sellPrice;
    const listTokens = liquidity * (liquidityFee / 100);

    return autoListing ? listTokens : 0;
};
