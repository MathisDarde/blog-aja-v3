"use server";

import { UpdateMethodeCoachSchema } from "@/app/schema";
import { updateMethodeCoach } from "@/controllers/MethodeCoachController";
import { FormResponse, UpdateMethodeCoachSchemaType } from "@/types/forms";

const updateMethodeCoachForm = async (
  id_methode: string,
  data: UpdateMethodeCoachSchemaType,
  userId: string
): Promise<FormResponse> => {
  try {
    const parsedData = UpdateMethodeCoachSchema.safeParse(data);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    try {
      await updateMethodeCoach(id_methode, parsedData.data, userId);
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

export default updateMethodeCoachForm;
