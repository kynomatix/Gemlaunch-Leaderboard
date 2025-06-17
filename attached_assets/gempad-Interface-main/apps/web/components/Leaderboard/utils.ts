import { Week } from './types';

export const getWeeksBetween = (startDate: Date, endDate = new Date()): Week[] => {
    const weeks: { year: number; week: number; startDateOfWeek: string; endDateOfWeek: string }[] =
        [];
    let currentDate = new Date(startDate.getTime());

    while (currentDate <= endDate) {
        const yearWeek = getYearWeek(currentDate);
        const { startDateOfWeek, endDateOfWeek } = getWeekStartEnd(currentDate);

        weeks.push({
            year: yearWeek.year,
            week: yearWeek.week,
            startDateOfWeek,
            endDateOfWeek,
        });

        // Move to the next Monday (add 7 days and adjust for day of week)
        const daysToAdd = currentDate.getDay() === 1 ? 7 : 8 - currentDate.getDay();
        currentDate.setDate(currentDate.getDate() + daysToAdd);
    }

    return weeks;
};

function getYearWeek(date: Date): { year: number; week: number } {
    const year = date.getFullYear();
    const firstDay = new Date(year, 0, 1); // January 1st of the given year

    // Get the day of the week (0 for Sunday, 6 for Saturday)
    const dayOfWeek = firstDay.getDay();

    // Adjust for weeks starting on Monday
    const daysToMonday = dayOfWeek === 0 ? 7 : dayOfWeek;

    // Add days to Monday of the first week
    firstDay.setDate(firstDay.getDate() + (daysToMonday - 1));

    // Calculate the difference in milliseconds
    const diffInMilliseconds = date.getTime() - firstDay.getTime();

    // One week in milliseconds
    const weekInMilliseconds = 7 * 24 * 60 * 60 * 1000;

    // Return the calculated week number (rounded up)
    const week = Math.ceil(diffInMilliseconds / weekInMilliseconds) + 1;

    return { year, week };
}

function getWeekStartEnd(date: Date): { startDateOfWeek: string; endDateOfWeek: string } {
    const dayOfWeek = date.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(date);
    monday.setDate(monday.getDate() - daysToSubtract);
    monday.setHours(0, 0, 0, 0); // Set time to 0 for consistency

    const endDate = new Date(monday.getTime());
    endDate.setDate(endDate.getDate() + 6); // Add 6 days to get to Sunday

    return {
        startDateOfWeek: monday.toISOString().slice(0, 10),
        endDateOfWeek: endDate.toISOString().slice(0, 10),
    };
}
