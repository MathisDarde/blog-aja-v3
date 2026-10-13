"use server";

import { LoginSchema } from "@/app/schema";
import { signIn } from "@/controllers/AuthentificationController";
import { FormResponse, LoginSchemaType } from "@/types/forms";

const submitLoginForm = async (
  data: LoginSchemaType
): Promise<FormResponse> => {
  try {
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