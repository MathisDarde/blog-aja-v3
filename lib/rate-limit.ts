import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Limitation de débit partagée entre instances (Vercel est serverless : un
// compteur en mémoire ne servirait à rien). Si Upstash n'est pas configuré ou
// est injoignable, on laisse passer plutôt que de bloquer tout le site.

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const limiters = redis
  ? {
      // connexion, inscription, mot de passe oublié... (par IP)
      auth: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "5 m"),
        prefix: "rl:auth",
      }),
      // publication de commentaires (par utilisateur)
      comment: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "1 m"),
        prefix: "rl:comment",
      }),
      // signalement de commentaires (par utilisateur)
      report: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "10 m"),
        prefix: "rl:report",
      }),
      // parties de quiz lancées (par utilisateur, ou par IP pour un visiteur)
      quiz: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, "10 m"),
        prefix: "rl:quiz",
      }),
      // upload d'images / vidéos (par utilisateur)
      upload: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(30, "10 m"),
        prefix: "rl:upload",
      }),
    }
  : null;

export type RateLimitBucket = "auth" | "comment" | "report" | "quiz" | "upload";

export function getClientIp(headers: Headers) {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function isRateLimited(
  bucket: RateLimitBucket,
  identifier: string,
): Promise<boolean> {
  if (!limiters) return false;

  try {
    const { success } = await limiters[bucket].limit(identifier);
    return !success;
  } catch (error) {
    console.error("Rate limit indisponible :", error);
    return false;
  }
}
