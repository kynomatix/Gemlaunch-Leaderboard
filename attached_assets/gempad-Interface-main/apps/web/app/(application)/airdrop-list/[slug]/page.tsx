import { DynamicPageProps } from '@/constants/types';
import AirdropDetails from './AirdropDetails';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Airdrop Details | Gemlaunch',
    description: 'Gemlaunch Airdorp Details',
};

export default function Page({ params }: DynamicPageProps) {
    return <AirdropDetails params={params} />;
}
