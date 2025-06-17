import CountdownTimer from '@/components/CountdownTimer';
import { Button, Box, Typography } from '@mui/material';

const SaleStatusInfo = ({ hasEnded, hasStarted, counterEnd, counterStart }) => {
    let statusMessage;
    let countdownTimer;

    if (hasEnded) {
        statusMessage = 'Sale Ended';
    } else if (hasStarted) {
        // statusMessage = `Sale Ends In: ${endsIn.humanize()}`;
        statusMessage = `Sale Ends In`;
        countdownTimer = <CountdownTimer endTime={counterEnd.toString()} />;
    } else {
        // statusMessage = `Sale Starts In: ${startsIn.humanize()}`;
        statusMessage = `Sale Starts In`;
        countdownTimer = <CountdownTimer endTime={counterStart.toString()} />;
    }

    return (
        <div>
            <Typography variant="body1" fontSize={18} fontWeight={600} textAlign="center" my={2}>
                {statusMessage}
            </Typography>
            {countdownTimer}
        </div>
    );
};

export default SaleStatusInfo;
