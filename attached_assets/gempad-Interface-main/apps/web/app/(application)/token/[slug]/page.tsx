import { DynamicPageProps } from '@/constants/types';
import { Metadata } from 'next';
import TokenDetails from './TokenDetails';

export const metadata: Metadata = {
    title: 'Lock Details | Gemlaunch',
    description: 'Gemlaunch Locked Token Details',
};

export default function Page({ params }: DynamicPageProps) {
    return <TokenDetails params={params} />;
}
