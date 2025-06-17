import { Metadata } from 'next';
import AntibotPage from './Antibot';

export const metadata: Metadata = {
    title: 'Gemlaunch | Antibot',
    description: 'Gemlaunch | Antibot',
    openGraph: {
        images: 'https://e346cce1445d0ba99bdec75f38daf5cf.ipfscdn.io/ipfs/bafybeicpzlg24r2pc5oicf7cjkm3gguc5hikpsa3okwrh5bv363okuceqe/AntiBot.jpg',
    },
};

export default function Page() {
    return <AntibotPage />;
}
