import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// Les controllers sont des "use server" : chaque fonction exportée est appelable
// directement depuis le navigateur. Ces gardes doivent donc être appelées côté
// serveur dans chaque fonction sensible, indépendamment du middleware.

export async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) throw new Error("Non authentifié");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.admin !== true) throw new Error("Accès refusé");
  return user;
}

export async function requireSelfOrAdmin(userId: string) {
  const user = await requireUser();
  if (user.id !== userId && user.admin !== true) {
    throw new Error("Accès refusé");
  }
  return user;
}
