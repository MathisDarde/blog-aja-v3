"use client";

import { useState } from "react";
import { LoginSchema } from "@/app/schema";
import { LoginSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import submitLoginForm from "@/actions/user/login-form";
import { toast } from "sonner";
import { Eye, EyeOff, X } from "lucide-react";
import { useFormErrorToasts } from "@/components/FormErrorsHook";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
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

  useFormErrorToasts(errors);

  return (
    <>
      <div className="max-w-[600px] mx-auto">
        <form
          method="POST"
          id="loginform"
          className="w-full"
          onSubmit={handleSubmit(handleSubmitForm)}
        >
          <div className="relative text-center w-full">
            <input
              {...register("email")}
              className="w-full my-4 py-3 sm:py-4 px-5 sm:px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
              placeholder="Adresse Mail"
            />
          </div>
          <div className="relative text-center w-full">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className="w-full my-4 py-3 sm:py-4 px-5 sm:px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
              placeholder="Mot de passe"
            />
            <span
              onClick={togglePasswordVisibility}
              className="cursor-pointer absolute top-[25px] sm:top-8 right-4 sm:right-5 text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 sm:w-6" />
              ) : (
                <Eye className="w-5 sm:w-6" />
              )}
            </span>
          </div>

          <div className="justify-center items-center bg-aja-blue inline-flex px-6 py-3 rounded-full font-Montserrat text-white text-sm sm:text-base">
            <button type="submit">Je me connecte</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default LoginForm;
