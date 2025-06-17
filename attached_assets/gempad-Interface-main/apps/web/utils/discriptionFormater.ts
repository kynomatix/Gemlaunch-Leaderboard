export function sanitizeDescription(description) {
    if (!description) return '';

    // Parse the HTML string into a DOM
    const parser = new DOMParser();
    const doc = parser.parseFromString(description, 'text/html');

    // Get all iframes
    const iframes = doc.querySelectorAll('iframe');

    // Remove iframes from their current positions
    iframes.forEach(iframe => iframe.remove());

    // Append iframes to the end of the body
    iframes.forEach(iframe => doc.body.appendChild(iframe));

    // Return the modified HTML
    return doc.body.innerHTML;
}