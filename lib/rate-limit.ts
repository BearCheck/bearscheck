import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type Duration = `${number} ${"ms" | "s" | "m" | "h" | "d"}`;

function makeLimiter(requests: number, window: Duration, prefix: string): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  const redis = new Redis({ url, token });
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    prefix: `rl:${prefix}`,
  });
}

// Fail-open: if Redis is not configured, rate limiting is skipped (no crash)
export const rateLimiters = {
  auth:        makeLimiter(5,   "1 h",  "auth"),        // 5 tentatives/heure/IP
  inscription: makeLimiter(3,   "24 h", "inscription"),  // 3 inscriptions/jour/IP
  comparateur: makeLimiter(20,  "1 m",  "comparateur"),  // 20 comparaisons/minute/IP
  general:     makeLimiter(100, "1 m",  "general"),      // 100 req/min/IP
};

export function getIP(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "anonymous";
}

export async function applyRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<Response | null> {
  if (!limiter) return null; // pas de Redis = pas de blocage

  const { success, limit, reset, remaining } = await limiter.limit(identifier);
  if (!success) {
    return new Response(
      JSON.stringify({
        error: "Trop de requêtes. Réessayez plus tard.",
        retryAfter: Math.round((reset - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": String(remaining),
          "X-RateLimit-Reset": String(reset),
          "Retry-After": String(Math.round((reset - Date.now()) / 1000)),
        },
      }
    );
  }
  return null;
}
