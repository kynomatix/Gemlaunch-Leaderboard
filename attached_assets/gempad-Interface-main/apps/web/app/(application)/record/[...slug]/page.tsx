import { Metadata } from 'next';
import Record from './Record';

export const metadata: Metadata = {
    title: 'Lock Record | Gemlaunch',
    description: 'Gemlaunch Lock Record',
};

export default function page({ params }: { params: { slug: string } }) {
    return <Record params={params} />;
}
