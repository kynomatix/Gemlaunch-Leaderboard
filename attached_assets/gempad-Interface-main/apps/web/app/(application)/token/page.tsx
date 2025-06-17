import { Metadata } from 'next';
import TokenTable from '@/components/TokenTable/TokenTable';

export const metadata: Metadata = {
    title: 'Locks | Gemlaunch',
    description: 'Locks Gemlaunch',
};

const page = () => {
    return <TokenTable isLpToken={false} baseRoute="token" />;
};

export default page;
