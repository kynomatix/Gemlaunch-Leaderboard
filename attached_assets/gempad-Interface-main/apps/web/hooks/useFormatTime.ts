import { useEffect, useState } from 'react';
import moment, { Moment } from 'moment';

const TimeFormats = {
    SECONDS: 'seconds',
    MINUTES: 'minutes',
    HOURS: 'hours',
    DAYS: 'days',
    WEEKS: 'weeks',
    YEARS: 'years',
};

type TimeFormats = (typeof TimeFormats)[keyof typeof TimeFormats];

const useFormattedTime = (seconds: number, defaultTime: boolean = false): string => {
    const [formattedTime, setFormattedTime] = useState('');

    // const time = defaultTime ? formattedTime : moment().format(seconds.toString(), '')

    useEffect(() => {
        const calculateFormattedTime = () => {
            const duration = moment.duration(seconds, 'seconds');
            let result = '';

            switch (true) {
                case duration.asMinutes() < 1:
                    result = `${duration.seconds()}s`;
                    break;
                case duration.asHours() < 1:
                    result = `${duration.minutes()}min`;
                    break;
                case duration.asDays() < 1:
                    result = `${duration.hours()}h`;
                    break;
                case duration.asDays() < 7:
                    result = `${duration.days()}d`;
                    break;
                case duration.asDays() < 365:
                    result = `${(duration.asDays() / 7).toFixed(1)}w`;
                    break;
                default:
                    // eslint-disable-next-line no-case-declarations
                    const momentInstance: Moment = moment().startOf('day').add(duration);
                    result = momentInstance.format(
                        'HH:mm:ss D [days] W [weeks] M [months] Y [years]',
                    );
            }

            setFormattedTime(result);
        };

        calculateFormattedTime();
    }, [seconds]);

    return formattedTime;
};

export { TimeFormats, useFormattedTime };
