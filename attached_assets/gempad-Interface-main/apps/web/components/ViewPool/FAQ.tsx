'use client';

import { AccordionDetails, Box, Typography, styled } from '@mui/material';
import React from 'react';
import PrimaryCard from '../Cards/PrimaryCard';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { questions } from './constant';

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion
        disableGutters
        sx={{ background: 'transparent', boxShadow: 'none' }}
        elevation={0}
        {...props}
    />
))(({ theme }) => ({
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem', color: '#fff' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const FAQ = () => {
    return (
        <Box>
            <Typography variant="subtitle2" fontSize={20} fontWeight={600} ml={4} mb={2} mt={4}>
                Frequently Asked Question
            </Typography>
            <PrimaryCard py={35}>
                {questions.map(({ id, question, answer }) => (
                    <Accordion key={id}>
                        <AccordionSummary>
                            <Typography variant="body1" color="common.white">
                                {question}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body1" fontSize={14} color="common.white">
                                {answer}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </PrimaryCard>
        </Box>
    );
};

export default FAQ;
