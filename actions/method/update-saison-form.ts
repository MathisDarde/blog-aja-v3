"use server";

import { UpdateMethodeSaisonSchema } from "@/app/schema";
import { updateMethodeSaison } from "@/controllers/MethodeSaisonController";
import { FormResponse, UpdateMethodeSaisonSchemaType } from "@/types/forms";

const updateMethodeSaisonForm = async (
  id_methode: string,
  data: UpdateMethodeSaisonSchemaType,
  userId: string
): Promise<FormResponse> => {
  try {
    const parsedData = UpdateMethodeSaisonSchema.safeParse(data);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    try {
      await updateMethodeSaison(id_methode, parsedData.data, userId);
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

export default updateMethodeSaisonForm;
