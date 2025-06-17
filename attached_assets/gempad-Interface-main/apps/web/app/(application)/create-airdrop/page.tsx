import CreateAirdropForm from '@/components/CreateAirdrop/CreateAirdropForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create Airdrop | Gemlaunch',
    description: 'Gemlaunch Airdrop Creation',
    openGraph: {
        images: 'https://e346cce1445d0ba99bdec75f38daf5cf.ipfscdn.io/ipfs/bafybeicpzlg24r2pc5oicf7cjkm3gguc5hikpsa3okwrh5bv363okuceqe/AIRDROP.jpg',
    },
};

const Page = () => {
    return <CreateAirdropForm />;
};

export default Page;
