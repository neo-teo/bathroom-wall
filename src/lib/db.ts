import { CLOUDINARY_API_SECRET, UPSTASH_REDIS_URL, USPTASH_REDIS_TOKEN } from '$env/static/private';
import { PUBLIC_CLOUDINARY_API_KEY, PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';
import prisma from '@prisma/client';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from "@upstash/redis"

export const db = new prisma.PrismaClient();

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: PUBLIC_CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

const redis = new Redis({
    url: UPSTASH_REDIS_URL,
    token: USPTASH_REDIS_TOKEN
})

export const rateLimit = {
    createPost: new Ratelimit({
        redis,
        analytics: true,
        prefix: "ratelimit:createPost",
        limiter: Ratelimit.tokenBucket(2, "20s", 2)
    }),
}

