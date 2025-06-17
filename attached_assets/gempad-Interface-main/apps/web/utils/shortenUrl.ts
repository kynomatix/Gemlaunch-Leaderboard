export const shortenUrl = (url: string, length: number): string => {
    if (url.length <= length) {
        return url;
    }

    const startLength = Math.ceil(length / 2);
    const endLength = length - startLength;
    const truncatedStart = url.substring(0, startLength);
    const truncatedEnd = url.substring(url.length - endLength);
    const truncatedUrl = `${truncatedStart}...${truncatedEnd}`;

    return truncatedUrl;
};
