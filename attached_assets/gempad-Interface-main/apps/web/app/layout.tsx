import './globals.css';
import type { Metadata } from 'next';
import Providers from '@/components/Provider';
import ThemeRegistry from '@/components/ThemeRegistory/ThemeRegistry';

import React, { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Container } from '@mui/material';
import DatePickerProvider from '@/components/LocalizationDatePicker';
import NavigationProvider from '@/components/Provider/NavigationProvider';
import { theme } from '@/components/ThemeRegistory/theme';
import NextTopLoader from 'nextjs-toploader';
import { bscTestnet } from 'viem/chains';
// timer css
import '@leenguyen/react-flip-clock-countdown/dist/index.css';

export const metadata: Metadata = {
    title: 'Gemlaunch',
    description: 'The Launchpad Protocol for Everyone',
    openGraph: {
        images: 'https://e346cce1445d0ba99bdec75f38daf5cf.ipfscdn.io/ipfs/bafybeigqgwf2djk52svtpahvhesyuq6tmvecljxb6wega6z76qmbtgx3t4/TheLaunchpad_Protocol.jpg',
    },
};

// const chains = [bscTestnet];

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.svg" sizes="any" />
            </head>
            <body>
                <Providers>
                    <NextTopLoader
                        color="#22CDA6"
                        showSpinner={false}
                        easing="ease"
                        zIndex={1600}
                        height={3}
                    />
                    <ThemeRegistry>
                        <ThemeProvider theme={theme}>
                            <DatePickerProvider>
                                <NavigationProvider>
                                    {/* <NetworkModal supportedChains={chains} /> */}
                                    <Container maxWidth="xl">{children}</Container>
                                </NavigationProvider>
                            </DatePickerProvider>
                        </ThemeProvider>
                    </ThemeRegistry>
                </Providers>
            </body>
        </html>
    );
}
