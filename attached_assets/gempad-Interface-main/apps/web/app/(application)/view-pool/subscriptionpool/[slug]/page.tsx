import { DynamicPageProps } from '@/constants/types';
import SubsDetails from './SubsDetails';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Pool Detail | Gemlaunch',
    description: 'Gemlaunch pool Details',
};

const Slug = ({ params }: DynamicPageProps) => {
    return <SubsDetails params={params} />;
};

export default Slug;
