// Post images live on Cloudinary; `transform` is an optional Cloudinary transformation like "w_32".
export function mediaUrl(mediaId: string, transform?: string) {
	const base = 'https://res.cloudinary.com/dlub8oz6b/image/upload';
	return transform ? `${base}/${transform}/${mediaId}` : `${base}/${mediaId}`;
}

const brightnessCache = new Map<string, Promise<number | null>>();

// Average brightness (0 = black, 1 = white) of the bottom part of an image, measured on a tiny copy.
// Resolves to null if the image can't be read (e.g. it failed to load).
export function bottomBrightness(mediaId: string, bottomFraction = 0.3): Promise<number | null> {
	const key = `${mediaId}:${bottomFraction}`;
	const cached = brightnessCache.get(key);
	if (cached) return cached;

	const result = new Promise<number | null>((resolve) => {
		const img = new Image();
		img.crossOrigin = 'anonymous'; // Cloudinary sends CORS headers, so the canvas stays readable
		img.onerror = () => resolve(null);
		img.onload = () => {
			try {
				const canvas = document.createElement('canvas');
				canvas.width = img.naturalWidth;
				canvas.height = img.naturalHeight;
				const context = canvas.getContext('2d');
				if (!context) return resolve(null);
				context.drawImage(img, 0, 0);

				const top = Math.floor(canvas.height * (1 - bottomFraction));
				const { data } = context.getImageData(0, top, canvas.width, canvas.height - top);
				let total = 0;
				for (let i = 0; i < data.length; i += 4) {
					total += (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
				}
				resolve(total / (data.length / 4));
			} catch {
				resolve(null);
			}
		};
		img.src = mediaUrl(mediaId, 'w_32');
	});

	brightnessCache.set(key, result);
	return result;
}

// A slight tilt per post (-2.25deg..2.25deg), worked out from its id so it's the same everywhere it renders.
export function postTilt(postId: string) {
	const seed = [...postId].reduce((sum, char) => sum + char.charCodeAt(0), 0);
	return ((seed % 7) - 3) * 0.75;
}
