"use server";

import { getUserbyId } from "@/controllers/UserController";

const displayUserInfo = async (id_user: string) => {
  try {
    if (!id_user) throw new Error("ID article manquant.");

    return await getUserbyId(id_user);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'article :", error);
    return null;
  }
};

export default displayUserInfo;
