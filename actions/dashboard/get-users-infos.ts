"use server";

import { getAllUsers } from "@/controllers/UserController";

const getUsersInfos = async () => {
  try {
    return getAllUsers();
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    return {
      success: false,
      message: "Erreur lors de la récupération des utilisateurs.",
    };
  }
};

export default getUsersInfos;
