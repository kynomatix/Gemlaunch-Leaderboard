import { DynamicPageProps } from '@/constants/types';
import PrivateSaleDetails from './PrivateSaleDetails';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Pool Detail | Gemlaunch',
    description: 'Gemlaunch pool Details',
};

export default function Page({ params }: DynamicPageProps) {
    return <PrivateSaleDetails params={params} />;
}
