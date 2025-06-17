import type { Metadata } from 'next';
import CreateLock from './CreateLock';

export const metadata: Metadata = {
    title: 'Locker | Gemlaunch',
    description: 'Gemlaunch Token Locker',
    openGraph: {
        images: 'https://e346cce1445d0ba99bdec75f38daf5cf.ipfscdn.io/ipfs/bafybeicpzlg24r2pc5oicf7cjkm3gguc5hikpsa3okwrh5bv363okuceqe/TokenLocker.jpg',
    },
};

const page = () => {
    return <CreateLock />;
};

export default page;
