"use server";

import { deleteUserPic } from "@/controllers/UserController";

const deletePhotoDeProfil = async (id_user: string) => {
  try {
    await deleteUserPic(id_user);
    return { success: true, message: "Photo supprimée avec succès." };
  } catch (error) {
    console.error("Erreur lors de la suppression de la photo :", error);
    return {
      success: false,
      message: "Erreur lors de la suppression de la photo.",
    };
  }
};

export default deletePhotoDeProfil;
