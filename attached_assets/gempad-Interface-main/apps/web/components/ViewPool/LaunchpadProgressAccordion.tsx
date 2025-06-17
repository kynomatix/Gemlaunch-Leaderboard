import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

interface ILaunchpadProgressAccordion {
    hasStarted: boolean;
    hasEnded: boolean;
    startTimeMoment: any;
    endTimeMoment: any;
}

export default function LaunchpadProgressAccordion({
    hasStarted,
    hasEnded,
    startTimeMoment,
    endTimeMoment,
}: ILaunchpadProgressAccordion) {
    const [activeStep, setActiveStep] = React.useState(0);

    React.useEffect(() => {
        if (!hasStarted && !hasEnded) {
            setActiveStep(0); // Waiting for pool start
        } else if (hasStarted && !hasEnded) {
            setActiveStep(1); // Pool Start
        } else {
            setActiveStep(2); // Pool Ended
        }
    }, [hasStarted, hasEnded]);

    const startTimeFormatted = startTimeMoment.utc().format('YYYY.MM.DD HH:mm:ssA ([UTC])');
    const endTimeFormatted = endTimeMoment.utc().format('YYYY.MM.DD HH:mm:ss:A ([UTC])');

    const steps = React.useMemo(() => {
        return [
            {
                label: 'Waiting for pool start',
                description: `No one can purchase`,
            },
            {
                label: 'Pool Start',
                description: `Pool starts at ${startTimeFormatted}`,
            },
            {
                label: 'Pool Ended',
                description: `Pool ends at ${endTimeFormatted}`,
            },
        ];
    }, [startTimeMoment, endTimeMoment]);

    return (
        <Box sx={{ widith: '100%' }}>
            <Stepper activeStep={activeStep} orientation="vertical" sx={{ px: '0px' }}>
                {steps.map((step, index) => (
                    <Step
                        key={step.label}
                        completed={index < activeStep}
                        sx={{
                            '& .MuiStepIcon-root': {
                                color: index <= activeStep ? 'secondary' : '#22CDA6',
                            },
                        }}
                    >
                        <StepLabel
                            StepIconProps={{
                                style: {
                                    color: index <= activeStep ? '#22CDA6' : 'secondary',
                                    transform: 'scale(0.5)',
                                },
                            }}
                        >
                            <Typography
                                variant="h5"
                                fontSize={12}
                                color={index <= activeStep ? 'primary' : 'secondary'}
                            >
                                {step.label}
                            </Typography>
                            <Typography
                                variant="h5"
                                color={index <= activeStep ? 'primary' : 'secondary'}
                                fontSize={10}
                            >
                                {step.description}
                            </Typography>
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
            {/* {activeStep === steps.length && (
                <Paper square elevation={0} sx={{ p: 3 }}>
                    <Typography>All steps completed - you&apos;re finished</Typography>
                    <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                        Reset
                    </Button>
                </Paper>
            )} */}
        </Box>
    );
}
