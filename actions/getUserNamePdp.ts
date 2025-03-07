"use server";

import UsersController from "@/controllers/UsersController";

const getUsernamePhoto = async (id_user: number) => {
  try {
    return await UsersController.getUserNamePdp(id_user);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return [];
  }
};

export default getUsernamePhoto;
