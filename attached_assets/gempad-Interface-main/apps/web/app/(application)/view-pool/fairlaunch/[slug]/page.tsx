import { DynamicPageProps } from '@/constants/types';
import React from 'react';
import FairlaunchDetails from './FairlaunchDetails';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Pool Detail | Gemlaunch',
    description: 'Gemlaunch pool Details',
};

const page = ({ params }: DynamicPageProps) => {
    return <FairlaunchDetails params={params} />;
};

export default page;
