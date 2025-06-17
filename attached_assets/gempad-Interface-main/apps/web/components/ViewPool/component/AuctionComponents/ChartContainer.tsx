import React from 'react';
import PrimaryCard from '@/components/Cards/PrimaryCard';
import { Gilroy } from '@/constants';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useQuery, gql, OperationVariables } from '@apollo/client';
import { GET_LAUNCHPAD_FOR_CHART } from '../../query';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { log } from 'console';
import { formatUnits } from 'viem';
import { combinedTokenMapFromUnsupportedUrlsAtom } from '@/state/lists/hooks';
import { LinerChartProps, QueryDataLaunchpad } from '../../types';
import { useChartContainer } from '@/hooks/useChartContainer';
import { any } from 'zod';
import { string } from 'yup';
import moment from 'moment';

interface CustomizedLabelProps {
    x?: number;
    y?: number;
    stroke?: string;
    value?: string;
}

const CustomizedLabel: React.FC<CustomizedLabelProps> = ({ x, y, stroke, value }) => (
    <text x={x} y={y} dy={-8} fill={stroke} fontSize={10} textAnchor="middle">
        {value}
    </text>
);

interface CustomizedAxisTickProps {
    x?: number;
    y?: number;
    stroke?: string;
    payload?: any;
}

const CustomizedAxisTick: React.FC<CustomizedAxisTickProps> = ({ x, y, stroke, payload }) => (
    <g transform={`translate(${x},${y})`}>
        <text
            x={21}
            y={0}
            dy={16}
            fontSize={14}
            textAnchor="end"
            fill="#666"
            transform="rotate(-13)"
        >
            {payload.value}
        </text>
    </g>
);

export const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const currentTime = new Date().toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });
        // const [day, month] = label.split(' ');
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    padding: '4px',
                    color: 'white',
                    backgroundColor: '#22CDAF40',
                    borderRadius: '4px',
                    fontFamily: Gilroy.style.fontFamily,
                    fontSize: '12px',
                }}
            >
                <p
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px',
                        paddingLeft: '2px',
                    }}
                >
                    Time: {label}
                </p>
                <p
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px',
                        paddingLeft: '2px',
                    }}
                >
                    price: {payload[0].value}
                </p>
            </div>
        );
    }
    return null;
};

function generateIntervals(
    startTime: dayjs.Dayjs,
    endTime: dayjs.Dayjs,
    startPrice: number,
    endPrice: number,
    decreaseInterval: number,
): { time: string; price: number }[] {
    const intervals: { time: string; price: number }[] = [];

    let currentTime = startTime;
    let currentPrice = startPrice;

    while (currentTime.isBefore(endTime)) {
        console.log({currentTime})
        const isoString = currentTime.toISOString();
        const formattedTime = isoString.slice(5, 16).replace('T', ' ');
        intervals.push({ time: formattedTime, price: currentPrice });
        // intervals.push({ time: moment.utc(+currentTime).format('HH:MM'), price: currentPrice });

        currentTime = currentTime.add(decreaseInterval, 'minute');
        currentPrice -=
            (startPrice - endPrice) * (decreaseInterval / endTime.diff(startTime, 'minute'));
    }

    return intervals;
}

const ChartContainer: React.FC<LinerChartProps> = ({ launchpadAddress }) => {
    const { chainId } = useActiveChainId();
    const {
        data: launchpadsData,
        loading,
        fetchMore,
    } = useQuery<QueryDataLaunchpad, OperationVariables>(GET_LAUNCHPAD_FOR_CHART, {
        variables: { contractAddress: launchpadAddress },
        context: { chainId },
        fetchPolicy: 'network-only',
    });

    const launchpad = launchpadsData?.launchPads[0];

    const { startPrice, endPrice, startTime, endTime, decreaseInterval } =
        useChartContainer(launchpadAddress);

    

    const chartData = generateIntervals(startTime, endTime, startPrice, endPrice, decreaseInterval);

    console.log({ startTime, endTime, chartData }, 'from chartContainer');

    const firstObj = chartData[0]?.time;
    const SecondObj = chartData[Math.floor(chartData.length / 4)]?.time ? chartData[Math.floor(chartData.length / 4)]?.time : null;
    const ThirdObj = chartData[Math.floor(chartData.length / 2)]?.time ? chartData[Math.floor(chartData.length / 2)]?.time : null;
    const fourthObj = chartData[chartData.length - 1]?.time;

    const numTicks = 4; // Number of ticks
    const tickStep = Math.ceil(chartData.length / (numTicks - 1)); // Calculate tick step

// Define the ticks array
    const ticks = chartData.length <= numTicks ? 
        chartData.map(data => data.time) : 
        Array.from({ length: numTicks }, (_, index) => {
            const dataIndex = Math.min(index * tickStep, chartData.length - 1);
            return chartData[dataIndex]?.time;
    });

    return (
        <>
            <Box mt={2}>
                <Typography variant="h5" fontSize={20} sx={{ mb: '15px', ml: '32px' }}>
                    Price History
                </Typography>
                <PrimaryCard py={30}>
                    <AreaChart
                        width={350}
                        height={200}
                        data={chartData}
                        style={{ position: 'relative', right: '20px', padding: '0px' }}
                    >
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="20%" stopColor="#22CDA6" stopOpacity={0.4} />
                                <stop offset="80%" stopColor="#22CDAF" stopOpacity={1} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="time"
                            tickLine={false}
                            tick={{ fill: '#fff' }}
                            style={{
                                // padding: '0 5px',
                                fontFamily: 'Gilroy',
                                fontSize: '12px',
                                // marginLeft: '-2rem'
                            }}
                            tickMargin={10}
                            // tickCount={4}
                            // interval="preserveStartEnd"
                            // interval={0}
                            domain={[chartData[0]?.time, chartData[chartData.length - 1]?.time]}
                            ticks={ticks}
                        />

                        <YAxis
                            dataKey="price"
                            tickLine={false}
                            tick={{ fill: '#fff' }}
                            style={{
                                padding: '0 20px',
                                fontFamily: 'Gilroy',
                                fontSize: '12px',
                            }}
                            // tickMargin={10}
                            tickCount={4}
                            // domain={[0, Number(prices[0]) + 5]}
                            // ticks={[
                            //     0,
                            //     prices[3],
                            //     prices[2],
                            //     prices[1],
                            //     prices[0],
                            //     Number(prices[0]) + 5,
                            // ]}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="linear"
                            dataKey="price"
                            stroke="#22CDA6"
                            fill="url(#colorUv)"
                            strokeWidth={2}
                            isAnimationActive={false}
                        />
                    </AreaChart>
                    <Typography variant="body1" fontSize={12} mt={2}>
                        The price will steadily decrease over time, meaning you will buy more tokens
                        as the time draws near to the end. The price will decrease each{' '}
                        {decreaseInterval} minutes.
                    </Typography>
                </PrimaryCard>

                {/* <PrimaryCard py={30}>
                        <AreaChart
                            width={350}
                            height={200}
                            data={data}
                            style={{ position: 'relative', right: '20px' }}
                        >
                            <CartesianGrid />
                            <XAxis dataKey="name" tick={<CustomizedAxisTick />} tickCount={4} />
                            <YAxis dataKey="pv" tickCount={5} />
                            <Tooltip content={<CustomTooltip />}/>
                            <Area
                                type="linear"
                                dataKey="pv"
                                stroke="#22CDA6"
                                strokeWidth={4}
                                dot={false}
                                activeDot={false}
                            />
                        </AreaChart>

                        <Typography variant="body1" fontSize={12} mt={2}>
                            The price will steadily decrease over time, meaning you will buy more tokens as the time draws near to the end. The price will decrease each {finalDecreaseInterval} minutes.
                        </Typography>
                    </PrimaryCard> */}
            </Box>
        </>
    );
};

export default ChartContainer;
