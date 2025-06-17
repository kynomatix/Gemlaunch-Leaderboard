'use client';
import { ChainId } from '@dapp/chains';
import { atom, useAtomValue } from 'jotai';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDeferredValue } from 'react';
import { isChainSupported } from '@/utils/wagmi';
import { useNetwork } from 'wagmi';
import { getChainId } from '@/config/chains';
import { useSessionChainId } from './useSessionChainId';

const queryChainIdAtom = atom(-1); // -1 unload, 0 no chainId on query

queryChainIdAtom.onMount = (set) => {
    const params = new URL(window.location.href).searchParams;
    let chainId;
    // chain has higher priority than chainId
    // keep chainId for backward compatible
    const c = params.get('chain');
    if (!c) {
        chainId = params.get('chainId');
    } else {
        chainId = getChainId(c);
    }
    if (chainId && isChainSupported(+chainId)) {
        set(+chainId);
    } else {
        set(0);
    }
};

export function useLocalNetworkChain() {
    const [sessionChainId] = useSessionChainId();
    // useRouter is kind of slow, we only get this query chainId once
    const queryChainId = useAtomValue(queryChainIdAtom);

    const chain = useSearchParams().get('chain');
    const chainId = +(sessionChainId || getChainId(chain as string) || queryChainId);

    if (isChainSupported(chainId)) {
        return chainId;
    }

    return undefined;
}

export const useActiveChainId = () => {
    const localChainId = useLocalNetworkChain();
    const queryChainId = useAtomValue(queryChainIdAtom);

    const { chain } = useNetwork();
    const chainId = localChainId ?? chain?.id ?? (queryChainId >= 0 ? ChainId.BSC : undefined);

    const isNotMatched = useDeferredValue(chain && localChainId && chain.id !== localChainId);

    return {
        chainId,
        isWrongNetwork: (chain?.unsupported ?? false) || isNotMatched,
        isNotMatched,
    };
};
