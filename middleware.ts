import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

type Session = typeof auth.$Infer.Session;

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const { data: session } = await betterFetch<Session>("/api/auth/get-session", {
    baseURL: request.nextUrl.origin,
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  // Si non connecté, rediriger vers /login
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si connecté mais pas admin et tente d'accéder à une route admin
  if (pathname.startsWith("/admin") && session.user?.admin !== true) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    "/moncompte",
    "/admin/:path*",
  ],
};
