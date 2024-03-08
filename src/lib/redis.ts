import { UPSTASH_REDIS_URL, USPTASH_REDIS_TOKEN } from '$env/static/private';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from "@upstash/redis"

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