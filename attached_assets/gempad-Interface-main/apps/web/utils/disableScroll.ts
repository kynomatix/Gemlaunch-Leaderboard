export const disableScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).blur();
};
