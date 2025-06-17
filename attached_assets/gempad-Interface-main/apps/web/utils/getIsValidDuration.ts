import dayjs from 'dayjs';

export function getIsValidDuration(ST: string, ET: string): boolean {
    const start = dayjs(ST);
    const end = dayjs(ET);
    const diff = end.diff(start, 'minutes');
    return diff <= 10080;
}
