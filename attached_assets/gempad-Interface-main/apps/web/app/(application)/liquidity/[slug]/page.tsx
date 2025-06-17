import { DynamicPageProps } from '@/constants/types';
import LiquidityDetails from './LiquidityDetails';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Lock Details | Gemlaunch',
    description: 'Gemlaunch Locked Token Details',
};

export default function Page({ params }: DynamicPageProps) {
    return <LiquidityDetails params={params} />;
}
