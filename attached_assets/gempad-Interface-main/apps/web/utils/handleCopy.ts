export const handleCopy = async (text: string, handleTooltipOpen: () => void) => {
    try {
        await navigator.clipboard.writeText(text);
        handleTooltipOpen();
    } catch (error) {
        console.error({ error });
    }
};
