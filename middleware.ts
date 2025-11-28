import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

type Session = typeof auth.$Infer.Session;

// Pages publiques où l'utilisateur **ne doit pas** être connecté
const publicPages = [
  "/login",
  "/register",
];

// Pages privées pour tout utilisateur connecté
const userPages = ["/moncompte"];

// Vérifier si une route est admin (y compris /articles/[id]/update)
function isAdminPage(pathname: string) {
  if (pathname.startsWith("/admin")) return true;
  // /articles/[id]/update
  const match = pathname.match(/^\/articles\/[^/]+\/update$/);
  return !!match;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  // 1️⃣ Non connecté
  if (!session) {
    if (
      [...userPages].some((p) => pathname.startsWith(p)) ||
      isAdminPage(pathname)
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next(); // pages publiques accessibles
  }

  // 2️⃣ Connecté, pages publiques
  if (publicPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3️⃣ Connecté, pages admin
  if (isAdminPage(pathname) && session.user?.admin !== true) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 4️⃣ Connecté, accès autorisé
  return NextResponse.next();
}

// Routes sur lesquelles le middleware s'applique
export const config = {
  matcher: [
    "/moncompte",
    "/admin/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/articles/:id/update",
  ],
};
