"use server";

import LoginForm from "@/app/login/_components/LoginForm";
import { LoginSchema } from "@/app/schema";
import { FormResponse, LoginSchemaType } from "@/types/forms";

const submitLoginForm = async (
    data: LoginSchemaType
) : Promise<FormResponse> => {
    try {
        const parsedData = LoginSchema.safeParse(data);

        if (!parsedData.success) {
            return { success: false, errors: parsedData.error.errors };
        }

        const 
    }
}