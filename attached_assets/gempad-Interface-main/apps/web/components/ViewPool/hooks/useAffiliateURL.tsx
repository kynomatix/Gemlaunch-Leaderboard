import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { zeroAddress } from 'viem';
import { useAccount } from 'wagmi';

const useRefIdUrl = () => {
    const [refIdUrl, setRefIdUrl] = useState('');
    const params = useSearchParams();
    const { address } = useAccount();

    useEffect(() => {
        const urlHasRefId = window.location.href.includes('refId=');
        const separator = window.location.href.includes('?') ? '&' : '?';

        let url;
        if (urlHasRefId) {
            const searchParams = new URLSearchParams(window.location.search);
            if (searchParams.get('refId') !== address) {
                searchParams.set('refId', address ?? zeroAddress);
                url = `${window.location.origin}${
                    window.location.pathname
                }?${searchParams.toString()}`;
            } else {
                url = window.location.href;
            }
        } else {
            url = `${window.location.href}${separator}refId=${address ?? zeroAddress}`;
        }

        setRefIdUrl(url);
    }, [address, zeroAddress]);

    return refIdUrl;
};

export default useRefIdUrl;
