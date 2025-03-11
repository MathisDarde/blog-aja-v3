"use server";

import { LoginSchema } from "@/app/schema";
import AuthentificationController from "@/controllers/AuthentificationController";
import { FormResponse, LoginSchemaType } from "@/types/forms";
import { checkPassword } from "@/utils/bcrypt";
import { generateToken } from "@/utils/jwt";

const submitLoginForm = async (
  data: LoginSchemaType
): Promise<FormResponse> => {
  try {
    const parsedData = LoginSchema.safeParse(data);

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.errors };
    }

    const user = await AuthentificationController.login(parsedData.data.email);
    if (!user) {
      return { success: false, message: "Email ou mot de passe incorrect" };
    }

    if (!(await checkPassword(parsedData.data.password, user.password))) {
      return { success: false, message: "Email ou mot de passe incorrect" };
    }

    const token = generateToken(user.user_id, user.email);

    return {
      success: true,
      message: "La connexion a été un succès !",
      token: token,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Quelque chose s'est mal passé, veuillez réessayer plus tard.",
    };
  }
};

export default submitLoginForm;
