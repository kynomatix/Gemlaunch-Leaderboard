'use client';
import React from 'react';
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';

const Timer = () => {
    return (
        <>
            <FlipClockCountdown
                to={new Date().getTime() + 24 * 3600 * 1000 + 5000}
                labels={['DAYS', 'HOURS', 'MINUTES', 'SECONDS']}
                renderMap={[true, true, true, true]}
                labelStyle={{
                    display: 'none',
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'rgba(255, 255, 255, 0.50)',
                }}
                digitBlockStyle={{ width: 45, height: 53, fontSize: 24 }}
                dividerStyle={{ color: 'white', height: 0 }}
                separatorStyle={{ size: '6px' }}
                duration={0.7}
            >
                Finished
            </FlipClockCountdown>
        </>
    );
};

export default Timer;
