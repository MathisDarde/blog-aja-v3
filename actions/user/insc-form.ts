"use server";

import { InscSchema } from "@/app/schema";
import { signUp } from "@/controllers/UserController";
import { FormResponse, InscSchemaType } from "@/types/forms";

const submitInscForm = async (data: InscSchemaType): Promise<FormResponse> => {
  try {
    const parsedData = InscSchema.safeParse(data);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    try {
      await signUp(parsedData.data);
      return { success: true, message: "Compte créé avec succès" };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Erreur lors de la création du compte",
      };
    }
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Erreur lors de la création du compte",
    };
  }
};

export default submitInscForm;
