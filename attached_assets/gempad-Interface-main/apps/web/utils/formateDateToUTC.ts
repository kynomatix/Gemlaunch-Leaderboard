import moment from 'moment';
export function formatSecondsToUTC(seconds: number) {
    const duration = moment.duration(seconds, 'seconds');

    const months = Math.floor(duration.asMonths());
    duration.subtract(months, 'months');

    const weeks = Math.floor(duration.asWeeks());
    duration.subtract(weeks, 'weeks');

    const days = Math.floor(duration.asDays());
    duration.subtract(days, 'days');

    const hours = duration.hours();
    const minutes = duration.minutes();
    const secondsRemaining = duration.seconds();

    const formattedDuration = `${months ? `${months}M` : ''} ${weeks ? `${weeks}W` : ''} ${
        days ? `${days}D` : ''
    } ${hours ? `${hours}H` : ''} ${minutes ? `${minutes}M` : ''} ${
        secondsRemaining ? `${secondsRemaining}S` : ''
    }`;

    return formattedDuration.trim();
}
