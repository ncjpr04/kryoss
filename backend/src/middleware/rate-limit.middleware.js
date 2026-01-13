// Very simple in-memory rate limiter suitable for single-instance deployments.
// For production with multiple instances, use a shared store (Redis, etc.).

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 200;

const buckets = new Map();

export const rateLimit = (req, res, next) => {
  const key = req.ip;
  const now = Date.now();

  const bucket = buckets.get(key) || { count: 0, windowStart: now };

  if (now - bucket.windowStart > WINDOW_MS) {
    bucket.count = 0;
    bucket.windowStart = now;
  }

  bucket.count += 1;
  buckets.set(key, bucket);

  if (bucket.count > MAX_REQUESTS) {
    res.status(429).json({
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many requests, please try again later.",
      },
    });
    return;
  }

  next();
};


