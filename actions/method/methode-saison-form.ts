"use server";

import { MethodeSaisonSchema } from "@/app/schema";
import { createMethodeSaison } from "@/controllers/MethodeSaisonController";
import { FormResponse, MethodeSaisonSchemaType } from "@/types/forms";

const submitMethodeSaisonForm = async (
  data: MethodeSaisonSchemaType,
  userId: string
): Promise<FormResponse> => {
  try {
    const parsedData = MethodeSaisonSchema.safeParse(data);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    try {
      await createMethodeSaison(parsedData.data, userId);
      return { success: true, message: "Méthode enregistrée avec succès !" };
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
      message: "Erreur lors l'enregistrement de la méthode.",
    };
  }
};

export default submitMethodeSaisonForm;
