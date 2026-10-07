// Google's formatted_address is "<street>, <city> <postal code>, <country>", with the US adding a
// "<state> <zip>" part, e.g. "17 Nassau Ave, Brooklyn, NY 11222, USA" or "Edessis 5, Thessaloniki 546 25, Greece".
// We only store that string, so split it back into its pieces for display.
const POSTCODE = /\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b|\b\d+(?:[\s-]\d+)*\b/; // UK, else numeric
const US_STATE = /^[A-Z]{2}$/;

export function formatAddress(address: string) {
    const parts = address.split(',').map((part) => part.trim()).filter(Boolean);
    if (parts.length < 2) return { street: address, city: '', postcode: '', country: '' };
    // Google autocomplete sometimes only gives "<city>, <country>", e.g. "Thessaloniki, Greece".
    if (parts.length === 2) return { street: '', city: parts[0], postcode: '', country: parts[1] };

    const country = parts.pop()!;

    const splitPostcode = (part: string) => {
        const postcode = part.match(POSTCODE)?.[0] ?? '';
        return { postcode, rest: part.replace(postcode, '').replace(/\s+/g, ' ').trim() };
    };

    let { postcode, rest: city } = splitPostcode(parts.pop()!);
    // In the US that part was "NY 11222", so the city is the part before it.
    if (US_STATE.test(city) && parts.length > 1) city = parts.pop()!;

    return { street: parts.join(', '), city, postcode, country };
}
