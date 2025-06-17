import { Metadata } from 'next';
import Edit from './Edit';

export const metadata: Metadata = {
    title: 'Edit Airdrop | Gemlaunch',
    description: 'Gemlaunch Airdorp Editor',
};

export default function Page() {
    return <Edit />;
}
