// Calculate the distance between two points using the Haversine formula
export function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Earth’s radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
}

const FAR_KM = 160.934; // 100 miles

// Format a distance in km as a short label, in miles for US visitors and km elsewhere.
export function formatDistance(km: number, locale: string = 'en-US') {
    if (km > FAR_KM) return 'far';

    const useMiles = locale === 'en-US';
    const value = useMiles ? km * 0.621371 : km;
    const unit = useMiles ? 'mi' : 'km';

    if (value < 0.1) return `<0.1 ${unit}`;
    if (value < 10) return `${value.toFixed(1)} ${unit}`;
    return `${Math.round(value).toLocaleString(locale)} ${unit}`;
}



// Distance label in the visitor's units, with a "~" when it's based on an IP guess rather than real location.
export function distanceLabel(km: number, isApproximate = false) {
    const label = formatDistance(km, typeof navigator === 'undefined' ? 'en-US' : navigator.language);
    return isApproximate && label !== 'far' ? `~${label}` : label;
}
