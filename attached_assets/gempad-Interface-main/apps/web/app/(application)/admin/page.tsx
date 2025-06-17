import React from 'react';
import Admin from './Admin';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin Panel | Gemlaunch',
    description: 'Gemlaunch admin panel',
};

const page = () => {
    return <Admin />;
};

export default page;
