import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_API_SECRET } from '$env/static/private';
import { PUBLIC_CLOUDINARY_API_KEY, PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';

cloudinary.config({
    cloud_name: PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: PUBLIC_CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

export default cloudinary;