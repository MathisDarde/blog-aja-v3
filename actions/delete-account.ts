"use server";

import UsersController from "@/controllers/UsersController";

const deleteAccount = async (id_user: number) => {
  try {
    return await UsersController.destroy(id_user);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return [];
  }
};

export default deleteAccount;
