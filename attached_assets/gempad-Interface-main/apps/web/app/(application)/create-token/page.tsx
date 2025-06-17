import { Metadata } from 'next';
import CreateToken from './CreateToken';

export const metadata: Metadata = {
    title: 'Create Token | Gemlaunch',
    description: 'Gemlaunch Token Creation',
    openGraph: {
        images: 'https://e346cce1445d0ba99bdec75f38daf5cf.ipfscdn.io/ipfs/bafybeicpzlg24r2pc5oicf7cjkm3gguc5hikpsa3okwrh5bv363okuceqe/CreateToken.jpg',
    },
};

export default function Page() {
    return <CreateToken />;
}
