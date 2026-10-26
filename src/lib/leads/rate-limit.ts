/**
 * Small in-memory rate limiter (per server instance). Enough to stop casual abuse.
 * For multi-instance production deployments, put the site behind a WAF / bot protection
 * or swap this for a shared store (e.g. Upstash Redis).
 */
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX = Number(process.env.LEAD_RATE_LIMIT_PER_10_MIN || 5);

export function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t > WINDOW_MS)) hits.delete(k);
  }
  return recent.length > MAX;
}
