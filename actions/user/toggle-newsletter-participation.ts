"use server";

import { toggleNewsletterSubscription } from "@/controllers/UserController";

const toggleNewsletter = async (userId: string, shouldEnable: boolean) => {
  try {
    if (!userId) throw new Error("ID user manquant.");

    await toggleNewsletterSubscription(userId, shouldEnable);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    return { success: false, error: (error as Error).message };
  }
};

export default toggleNewsletter;
