import React from 'react';
import { Metadata } from 'next';
import ViewPool from './ViewPool';

export const metadata: Metadata = {
    title: 'View Pool | Gemlaunch',
    description: 'Gemlaunch View Pool',
};

const page = () => {
    return <ViewPool />;
};

export default page;
