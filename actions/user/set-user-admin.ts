"use server";

import { setUserAdmin } from "@/controllers/UserController";

const giveUserAdmin = async (id_user: string) => {
  try {
    if (!id_user) throw new Error("ID user manquant.");

    await setUserAdmin(id_user);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    return { success: false, error: (error as Error).message };
  }
};

export default giveUserAdmin;
