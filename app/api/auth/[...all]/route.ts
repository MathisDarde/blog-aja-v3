import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";

const handlers = toNextJsHandler(auth);

// Endpoints sensibles au brute-force / spam d'emails
const RATE_LIMITED_PATHS = [
  "/sign-in",
  "/sign-up",
  "/forget-password",
  "/request-password-reset",
  "/reset-password",
  "/change-email",
  "/send-verification-email",
];

export const GET = handlers.GET;

export async function POST(request: Request) {
  const path = new URL(request.url).pathname.replace(/^\/api\/auth/, "");

  if (
    RATE_LIMITED_PATHS.some((p) => path.startsWith(p)) &&
    (await isRateLimited("auth", getClientIp(request.headers)))
  ) {
    return Response.json(
      { message: "Trop de tentatives, réessayez dans quelques minutes." },
      { status: 429 },
    );
  }

  return handlers.POST(request);
}
