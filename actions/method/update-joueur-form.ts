"use server";

import { UpdateMethodeJoueurSchema } from "@/app/schema";
import { updateMethodeJoueur } from "@/controllers/MethodeJoueurController";
import { FormResponse, UpdateMethodeJoueurSchemaType } from "@/types/forms";

const updateMethodeJoueurForm = async (
  id_methode: string,
  data: UpdateMethodeJoueurSchemaType,
  userId: string
): Promise<FormResponse> => {
  try {
    const parsedData = UpdateMethodeJoueurSchema.safeParse(data);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    try {
      await updateMethodeJoueur(id_methode, parsedData.data, userId);
      return { success: true, message: "Méthode modifiée avec succès !" };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Quelque chose s'est mal passé, veuillez réessayer plus tard.",
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Erreur lors la modification de la méthode.",
    };
  }
};

export default updateMethodeJoueurForm;
