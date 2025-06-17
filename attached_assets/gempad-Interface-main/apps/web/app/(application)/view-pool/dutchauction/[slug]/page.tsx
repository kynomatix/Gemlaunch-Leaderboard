import { DynamicPageProps } from '@/constants/types';
import { Metadata } from 'next';
import DutchDetails from './DutchDetails';

export const metadata: Metadata = {
    title: 'Pool Detail | Gemlaunch',
    description: 'Gemlaunch pool Details',
};

const Slug = ({ params }: DynamicPageProps) => {
    return <DutchDetails params={params} />;
};

export default Slug;
