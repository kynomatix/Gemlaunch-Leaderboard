import Details from '@/components/AntiBot/Details';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Gemlaunch | Antibot',
    description: 'Gemlaunch | Antibot',
};

export default function Page({ params }: { params: { id: string } }) {
    return <Details tokenAddress={params?.id} />;
}
