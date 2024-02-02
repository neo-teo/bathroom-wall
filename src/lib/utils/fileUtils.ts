
/**
 * @param file file to process
 * @param captureData hidden capture data input element, which we fill in with the compressed file data
 * @param captureAR hidden capture aspect ratio input element, which we fill in with the compress file aspect ratio
 */
export const readImageFileAndFillInCaptureInfo = (file: File, captureData: HTMLInputElement, captureAR: HTMLInputElement): void => {
    const reader = new FileReader();

    reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            // resizing image and getting its compressed data url, width, and height
            const { url, width, height } = resizeAndConvertToJPEG(img);
            // filling in hidden input components with this compressed info
            captureData.value = url;
            captureAR.value = `${width}:${height}`;
        };
        img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
}

export const resizeAndConvertToJPEG = (img: HTMLImageElement): { url: string, width: number, height: number } => {

    const maxDimension = 900; // currently maximum height or width is 900px

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

    return { url: canvas.toDataURL('image/jpeg'), width: width, height: height };
};