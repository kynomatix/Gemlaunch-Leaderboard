import CustomDrawer from '@/components/CustomDrawer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Gemlaunch',
    description: 'Gemlaunch',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return <CustomDrawer>{children}</CustomDrawer>;
}
