"use server";

import { setUserAdmin } from "@/controllers/UserController";

const giveUserAdmin = async (id_user: string) => {
  try {
    if (!id_user) throw new Error("ID user manquant.");

    return await setUserAdmin(id_user);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return null;
  }
};

export default giveUserAdmin;
