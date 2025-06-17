import React from 'react';
import PrivateSaleForm from '@/components/PrivateSaleForm/PrivateSaleForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: ' Private Sale | Gemlaunch',
    description: 'Gemlaunch Private Sale',
    openGraph: {
        images: 'https://e346cce1445d0ba99bdec75f38daf5cf.ipfscdn.io/ipfs/bafybeicpzlg24r2pc5oicf7cjkm3gguc5hikpsa3okwrh5bv363okuceqe/PrivateSale.jpg',
    },
};

const page = () => {
    return <PrivateSaleForm />;
};

export default page;
