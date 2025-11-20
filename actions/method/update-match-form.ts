"use server";

import { UpdateMethodeMatchSchema } from "@/app/schema";
import { updateMethodeMatch } from "@/controllers/MethodeMatchController";
import { FormResponse, UpdateMethodeMatchSchemaType } from "@/types/forms";

const updateMethodeMatchForm = async (
  id_methode: string,
  data: UpdateMethodeMatchSchemaType,
  userId: string
): Promise<FormResponse> => {
  try {
    const parsedData = UpdateMethodeMatchSchema.safeParse(data);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    try {
      await updateMethodeMatch(id_methode, parsedData.data, userId);
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

export default updateMethodeMatchForm;
