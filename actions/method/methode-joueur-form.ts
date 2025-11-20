"use server";

import { MethodeJoueurSchema } from "@/app/schema";
import { createMethodeJoueur } from "@/controllers/MethodeJoueurController";
import { FormResponse, MethodeJoueurSchemaType } from "@/types/forms";

const submitMethodeJoueurForm = async (
  data: MethodeJoueurSchemaType,
  userId: string
): Promise<FormResponse> => {
  try {
    const parsedData = MethodeJoueurSchema.safeParse(data);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    try {
      await createMethodeJoueur(parsedData.data, userId);
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

export default submitMethodeJoueurForm;
