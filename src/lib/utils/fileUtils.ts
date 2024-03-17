export const resizeAndConvertToJPEG = (img: HTMLImageElement): string => {

    const maxDimension = 1200; // currently maximum height or width is 1200px

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

    const maxFileSizeBytes = 10 * 1024 * 1024; // 10 MB
    while (dataUrl.length > maxFileSizeBytes) {
        quality -= 0.1; // Decrease quality by 10% each iteration
        dataUrl = canvas.toDataURL('image/jpeg', quality);
    }

    return dataUrl;
};