"use server";

import { updateProfileSchema } from "@/app/schema";
import { updateUser } from "@/controllers/UserController";
import { FormResponse, UpdateProfileSchemaType } from "@/types/forms";

// Cette fonction met à jour le profil de l'utilisateur avec les données et le fichier
const updateProfileForm = async (
  userId: string,
  data: UpdateProfileSchemaType,
  file?: File
): Promise<FormResponse> => {
  try {
    // Vérifie la validité des données envoyées
    const parsedData = updateProfileSchema.safeParse(data);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    // Met à jour l'utilisateur avec les données et le fichier
    const updateProfile = await updateUser(userId, data, file);

    if (!updateProfile) {
      return {
        success: false,
        message: "Erreur lors de la modification du profil",
      };
    }

    return { success: true, message: "Profil mis à jour avec succès" };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Erreur lors de la modification du profil",
    };
  }
};

export default updateProfileForm;
