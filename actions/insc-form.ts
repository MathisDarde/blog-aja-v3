"use server";

import { InscSchema } from "@/app/schema";
import UsersController from "@/controllers/UsersController";
import { FormResponse, InscSchemaType } from "@/types/forms";

const submitInscForm = async (data: InscSchemaType): Promise<FormResponse> => {
  try {
    const parsedData = InscSchema.safeParse(data);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    const registerUser = await UsersController.store(data);
    if (!registerUser) {
      return {
        success: false,
        message: "Erreur lors de la création du compte",
      };
    }

    return { success: true, message: "Compte créé avec succès" };
  } catch (err) {
    console.log(err);
    return { success: false, message: "Erreur lors de la création du compte" };
  }
};

export default submitInscForm;
