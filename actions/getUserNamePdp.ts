"use server";

import { getUserPicName } from "@/controllers/UserController";

const getUsernamePhoto = async (id: string) => {
  try {
    return await getUserPicName(id);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return [];
  }
};

export default getUsernamePhoto;
