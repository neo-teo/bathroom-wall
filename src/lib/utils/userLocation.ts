// The visitor's real location, cached in localStorage for an hour so we don't keep asking the browser.
export type LatLng = { lat: number; lng: number };

const STORAGE_KEY = 'user_location';
const MAX_AGE_MS = 60 * 60 * 1000; // 1 hr

export function getStoredLocation(): LatLng | null {
	try {
		const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
		if (stored && Date.now() - stored.timestamp < MAX_AGE_MS) {
			return { lat: stored.lat, lng: stored.lng };
		}
	} catch {}
	return null;
}

function storeLocation(location: LatLng) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...location, timestamp: Date.now() }));
	} catch {}
}

// Asks the browser for the current position (may prompt) and caches it.
export async function requestLocation(): Promise<LatLng> {
	const position = await new Promise<GeolocationPosition>((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject);
	});
	const location = { lat: position.coords.latitude, lng: position.coords.longitude };
	storeLocation(location);
	return location;
}

// The cached location, or a fresh one only if the visitor already granted access, so this never prompts.
export async function getLocationWithoutPrompt(): Promise<LatLng | null> {
	const stored = getStoredLocation();
	if (stored) return stored;

	try {
		const permission = await navigator.permissions?.query({ name: 'geolocation' });
		return permission?.state === 'granted' ? await requestLocation() : null;
	} catch {
		return null;
	}
}
