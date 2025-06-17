import { GemlaunchToken, LaunchPad, PrivateSale } from '@/src/gql/graphql';
import { Address } from 'viem';

export enum ListType {
    PRIVATE_SALE,
    LAUNCHPAD,
    TOKEN,
}
export interface ListCardRowProps {
    title: string;
    desc: string;
    image: string;
    buttonTitle: string;
    addr: string;
    chainId: number;
    listType: ListType;
}

export interface GemTokensQueryData {
    gemlaunchTokens: GemlaunchToken[];
}

export interface LatestPoolsQueryData {
    launchPads: LaunchPad[];
}

export interface PrivateSaleQueryData {
    privateSales: PrivateSale[];
}
