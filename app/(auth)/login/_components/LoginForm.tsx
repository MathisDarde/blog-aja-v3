"use client";

import { useState } from "react";
import { LoginSchema } from "@/app/schema";
import { LoginSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "@/components/BlueButton";
import submitLoginForm from "@/actions/user/login-form";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { Eye, EyeOff, X } from "lucide-react";
import { useFormErrorToasts } from "@/components/FormErrorsHook";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState : { errors } } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  });

  const handleSubmitForm = async (data: LoginSchemaType) => {
    const response = await submitLoginForm(data);
    if (response.success) {
      window.location.href = "/";
    } else {
      toast.error(
        response.message ? response.message : response.errors?.[0].message,
        {
          icon: <X className="text-white" />,
          className: "bg-red-500 border border-red-200 text-white text-base",
        }
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useFormErrorToasts(errors)

  return (
    <>
      <div className="w-[600px] mx-auto">
        <form
          method="POST"
          id="loginform"
          className="w-[600px]"
          onSubmit={handleSubmit(handleSubmitForm)}
        >
          <div className="relative text-center w-[600px]">
            <input
              {...register("email")}
              className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
              placeholder="Adresse Mail"
            />
          </div>
          <div className="relative text-center w-[600px]">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
              placeholder="Mot de passe"
            />
            <span
              onClick={togglePasswordVisibility}
              className="cursor-pointer absolute top-8 right-5"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </span>
          </div>

          <div className="flex justify-center items-center">
             <Button type="submit">Je me connecte</Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default LoginForm;
