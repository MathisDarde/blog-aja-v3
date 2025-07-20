"use server";

import { MethodeCoachSchema } from "@/app/schema";
import { createMethodeCoach } from "@/controllers/MethodeCoachController";
import { FormResponse, MethodeCoachSchemaType } from "@/types/forms";

const submitMethodeCoachForm = async (
  data: MethodeCoachSchemaType,
  file: File,
  userId: string
): Promise<FormResponse> => {
  try {
    const parsedData = MethodeCoachSchema.safeParse(data);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    try {
      await createMethodeCoach(parsedData.data, file, userId);
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

export default submitMethodeCoachForm;
