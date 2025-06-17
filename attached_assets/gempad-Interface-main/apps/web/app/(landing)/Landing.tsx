'use client';

import React from 'react';
import Hero from '@/components/Hero/Hero';
import Stats from '@/components/Stats/Stats';
import AOS from 'aos';
import TokenSales from '@/components/TokenSales/TokenSales';
import Services from '@/components/Services/Services';
import Comunity from '@/components/Comunity/Comunity';
import NewsLetter from '@/components/NewsLetter/NewsLetter';
import { CurrencyData } from '@/constants/types';

const Landing = ({ currencyData }: { currencyData: CurrencyData }) => {
    React.useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false,
        });
    }, []);

    return (
        <div>
            <Hero />
            <Stats currencyData={currencyData} />
            <TokenSales />
            <Services />
            <Comunity />
            <NewsLetter />
        </div>
    );
};

export default Landing;
