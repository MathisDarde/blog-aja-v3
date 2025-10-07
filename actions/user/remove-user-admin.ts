"use server";

import { removeUserAdmin } from "@/controllers/UserController";

const removeUserAdminRole = async (id_user: string) => {
  try {
    if (!id_user) throw new Error("ID user manquant.");

    return await removeUserAdmin(id_user);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return null;
  }
};

export default removeUserAdminRole;
