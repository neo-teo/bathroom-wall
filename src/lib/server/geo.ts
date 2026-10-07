import type { LatLng } from '$lib/utils/userLocation';

// Netlify adds an `x-nf-geo` header (base64 JSON) with the visitor's IP-based location, roughly city level.
export function approximateLocationFromHeaders(headers: Headers): LatLng | null {
    const header = headers.get('x-nf-geo');
    if (!header) return null;

    try {
        const geo = JSON.parse(Buffer.from(header, 'base64').toString('utf8'));
        const lat = Number(geo.latitude);
        const lng = Number(geo.longitude);
        return Number.isFinite(lat) && Number.isFinite(lng) && (lat || lng) ? { lat, lng } : null;
    } catch {
        return null;
    }
}
