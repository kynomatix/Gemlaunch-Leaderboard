import { DynamicPageProps } from '@/constants/types';
import LaunchpadDetails from './LaunchpadDetails';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Pool Detail | Gemlaunch',
    description: 'Gemlaunch pool Details',
};

const Slug = ({ params }: DynamicPageProps) => {
    return <LaunchpadDetails params={params} />;
};

export default Slug;
