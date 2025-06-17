import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'; // Enable UTC plugin
dayjs.extend(utc);

export const getCurrentTimeDayjs = () => {
    return dayjs.utc().unix().toString();
};
