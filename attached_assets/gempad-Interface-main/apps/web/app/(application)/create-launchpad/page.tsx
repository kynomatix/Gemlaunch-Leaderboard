import React from 'react';
import LaunchpadForm from '@/components/LaunchpadForm/LaunchpadForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Launchpad | Gemlaunch',
    description: 'Gemlaunch Launchpad',
    openGraph: {
        images: 'https://e346cce1445d0ba99bdec75f38daf5cf.ipfscdn.io/ipfs/bafybeicpzlg24r2pc5oicf7cjkm3gguc5hikpsa3okwrh5bv363okuceqe/LAUNCHPAD.jpg',
    },
};

const page = () => {
    return <LaunchpadForm />;
};

export default page;
