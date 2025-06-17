export function extractAddressFromPathname(pathname: string) {
    const parts = pathname.split('/');

    const lastPart = parts[parts.length - 1].toLowerCase();

    const url = new URL(window.location.href);
    const queryParams = url.searchParams;

    const isAddress = /^0x[a-fA-F0-9]{40}$/.test(lastPart);

    // Return the address if valid, otherwise return null
    return isAddress ? lastPart : null;
}
