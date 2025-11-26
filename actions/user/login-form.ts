"use server";

import { LoginSchema } from "@/app/schema";
import { signIn } from "@/controllers/AuthentificationController";
import { FormResponse, LoginSchemaType } from "@/types/forms";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

// 1. Configuration du Limiteur (Singleton)
// slidingWindow(5, "15 m") = 5 tentatives max par fenêtre de 15 minutes
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  prefix: "@auth/login", // Préfixe pour bien séparer dans Redis
});

const submitLoginForm = async (
  data: LoginSchemaType
): Promise<FormResponse> => {
  try {
    // 2. Récupération de l'IP (Sécurité)
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "127.0.0.1";

    // 3. Vérification du Rate Limit
    // On utilise l'IP comme identifiant unique
    const { success, reset } = await ratelimit.limit(`login_${ip}`);

    if (!success) {
      // Calcul du temps restant pour afficher un message précis
      const now = Date.now();
      const timeRemaining = Math.floor((reset - now) / 1000 / 60);
      
      return {
        success: false,
        message: `Trop de tentatives. Réessayez dans ${timeRemaining + 1} minutes.`,
      };
    }

    // --- LOGIQUE EXISTANTE CI-DESSOUS ---

    const parsedData = LoginSchema.safeParse(data);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    try {
      await signIn(parsedData.data);
      return { success: true, message: "Connexion effectuée avec succès !" };
    } catch (error) {
      // Pour la sécurité, évite de loguer l'erreur exacte côté client
      // Mais garde un log serveur
      console.error("Erreur Auth:", error);
      
      return {
        success: false,
        // Message générique pour ne pas aider les pirates
        message: "Identifiants incorrects ou erreur serveur.", 
      };
    }
  } catch (err) {
    console.error("Erreur Globale:", err);
    return {
      success: false,
      message: "Une erreur inattendue est survenue.",
    };
  }
};

export default submitLoginForm;