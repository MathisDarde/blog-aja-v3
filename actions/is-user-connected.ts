"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const isAuthenticated = async () => {
  try {
    const requestHeaders = await headers();

    const session = await auth.api.getSession({
      headers: new Headers(requestHeaders),
    });

    return session;
  } catch (error) {
    console.error(
      "Erreur lors de la vérification de l'authentification:",
      error
    );
    return null;
  }
};
