/**
 * Rate limit in-memory sederhana per IP (PRD §6, Fase 5.3).
 * Cukup untuk MVP single-instance; di Vercel serverless berlaku per-instance,
 * kalau butuh ketat lintas-instance pakai Upstash Redis (roadmap).
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "local";
}

// Cegah kebocoran memori: buang bucket kedaluwarsa saat map membengkak
function sweep(now: number) {
  if (buckets.size < 1000) return;
  for (const [ip, b] of buckets) {
    if (now > b.resetAt) buckets.delete(ip);
  }
}

export function rateLimit(
  req: Request,
  { limit = 10, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
): { ok: boolean; retryAfter: number } {
  const ip = clientIp(req);
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(ip);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  bucket.count++;
  if (bucket.count > limit) {
    return {
      ok: false,
      retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }
  return { ok: true, retryAfter: 0 };
}
