"use server";

import { LoginSchema } from "@/app/schema";
import { signIn } from "@/controllers/AuthentificationController";
import { FormResponse, LoginSchemaType } from "@/types/forms";

const submitLoginForm = async (
  data: LoginSchemaType
): Promise<FormResponse> => {
  try {
    const parsedData = LoginSchema.safeParse(data);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    try {
      await signIn(parsedData.data);
      return { success: true, message: "Connexion effectuée avec succès !" };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: "Quelque chose s'est mal passé, veuillez réessayer plus tard.",
      };
    }
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Erreur lors de connexion",
    };
  }
};

export default submitLoginForm;
