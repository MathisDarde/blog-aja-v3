"use server";

import { MethodeMatchSchema } from "@/app/schema";
import { createMethodeMatch } from "@/controllers/MethodeMatchController";
import { FormResponse, MethodeMatchSchemaType } from "@/types/forms";

const submitMethodeMatchForm = async (
  data: MethodeMatchSchemaType,
  userId: string
): Promise<FormResponse> => {
  try {
    const parsedData = MethodeMatchSchema.safeParse(data);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    try {
      await createMethodeMatch(parsedData.data, userId);
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

export default submitMethodeMatchForm;
