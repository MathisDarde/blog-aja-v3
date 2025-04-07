"use server";

import { deleteUser } from "@/controllers/UserController";

const deleteAccount = async (id_user: string) => {
  try {
    await deleteUser(id_user);
    return { success: true, message: "Utilisateur supprimé avec succès." };
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
    return {
      success: false,
      message: "Erreur lors de la suppression du compte.",
    };
  }
};

export default deleteAccount;
