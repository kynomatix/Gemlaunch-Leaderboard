import MultisenderForm from '@/components/MultisenderForm/MultisenderForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Multisender | Gemlaunch',
    description: 'Gemlaunch Mutisender',
    openGraph: {
        images: 'https://e346cce1445d0ba99bdec75f38daf5cf.ipfscdn.io/ipfs/bafybeicpzlg24r2pc5oicf7cjkm3gguc5hikpsa3okwrh5bv363okuceqe/Multisender.jpg',
    },
};

export default function Page() {
    return <MultisenderForm />;
}
