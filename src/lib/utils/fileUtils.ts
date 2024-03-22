export const resizeAndConvertToJPEG = (img: HTMLImageElement): string => {

    const maxDimension = 1000;

    let { width, height } = img;

    // downscaling if necessary
    if (width > maxDimension || height > maxDimension) {
        const widthRatio = maxDimension / width;
        const heightRatio = maxDimension / height;

        const scaleFactor = Math.min(widthRatio, heightRatio);
        width *= scaleFactor;
        height *= scaleFactor;
    }

    // draw the image on a canvas with new dimensions
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    // Adjust JPEG quality to meet file size limit
    let quality = 1.0; // Initial JPEG quality

    let dataUrl = canvas.toDataURL('image/jpeg', quality);

    /**
     * Yikes! 
     * 
     * Cloudinary supports uploads up to 10MB so it really
     *   could be maxFileSizeBytes = 10 * 1024 * 1024 (Bytes)
     * However, since we are sending this data to the backend we have a 
     *   tighter restriction of 524288 bytes .... doioioing
     */
    const maxFileSizeBytes = 524288
    while (dataUrl.length > maxFileSizeBytes) {
        quality -= 0.1; // Decrease quality by 10% each iteration
        dataUrl = canvas.toDataURL('image/jpeg', quality);
    }

    return dataUrl;
};