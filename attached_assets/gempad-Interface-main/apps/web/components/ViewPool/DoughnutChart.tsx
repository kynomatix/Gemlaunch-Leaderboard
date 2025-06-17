'use client';

import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import PrimaryCard from '../Cards/PrimaryCard';

import { PieChart, Pie, Label, Cell, ResponsiveContainer, Legend } from 'recharts';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const data = [
    { name: 'Presale', value: 400 },
    { name: 'Liquidity', value: 300 },
    { name: 'Affiliate', value: 300 },
    { name: 'Burnt', value: 200 },
];

const CustomLegend = ({ payload }) => {
    const isMobile = useMediaQuery('(max-width:600px)');
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: isMobile ? 'row' : 'column',
                gap: '10px',
                flexWrap: 'wrap',
            }}
        >
            {payload.map((entry, index) => (
                <Box
                    key={`legend-${index}`}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '11px',
                    }}
                >
                    <Box
                        sx={{
                            width: isMobile ? '20px' : '45px',
                            height: '6px',
                            background: entry.color,
                        }}
                    ></Box>
                    <Typography variant="h5" fontSize={12} color="common.white">
                        {entry.value}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

const DoughnutChart = () => {
    const isMobile = useMediaQuery('(max-width:600px)');
    return (
        <Box>
            <Typography variant="subtitle2" fontSize={20} ml={4} mb={2} mt={4}>
                Token Matrices
            </Typography>
            <PrimaryCard>
                <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                    <Typography
                        sx={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    >
                        Hello
                    </Typography>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={data}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={0}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>

                            {/* <Legend
                                layout="vertical"
                                verticalAlign={isMobile ? 'top' : 'middle'}
                                align={isMobile ? 'center' : 'right'}
                                iconSize={15}
                                content={<CustomLegend payload={data} />}
                            /> */}
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            </PrimaryCard>
        </Box>
    );
};

export default DoughnutChart;
