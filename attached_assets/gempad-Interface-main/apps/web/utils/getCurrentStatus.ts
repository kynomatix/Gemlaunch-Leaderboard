export const getCurrentStatus = (status: number): string => {
    // Upcomming
    if (status === 0) {
        return 'PENDING';
    }

    // Live
    if (status === 1) {
        return 'ACTIVE';
    }

    // Cancelled
    if (status === 2) {
        return 'CANCELLED';
    }

    if (status === 3) {
        return 'Ended';
    }

    return '';
};
