"use server";

import { removeUserAdmin } from "@/controllers/UserController";

const removeUserAdminRole = async (id_user: string) => {
  try {
    if (!id_user) throw new Error("ID user manquant.");

    await removeUserAdmin(id_user); // Ne récupère pas le QueryResult
    return { success: true }; // objet simple, sérialisable
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    return { success: false, error: (error as Error).message };
  }
};

export default removeUserAdminRole;
