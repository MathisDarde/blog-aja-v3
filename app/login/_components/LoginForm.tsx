"use client";

import { useState } from "react";
import { LoginSchema } from "@/app/schema";
import { LoginSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "@/components/BlueButton";
import submitLoginForm from "@/actions/login-form";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { cn } from "@/utils/cn";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";
import { X } from "lucide-react";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  });

  const handleSubmitForm = async (data: LoginSchemaType) => {
    const response = await submitLoginForm(data);
    if (response.success) {
      localStorage.setItem("token", response.token as string);
      redirect("/");
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

  return (
    <>
      <div className="w-w-600 mx-auto">
        <form
          method="POST"
          id="loginform"
          className="w-w-600"
          onSubmit={handleSubmit(handleSubmitForm)}
        >
          <div className="relative text-center w-w-600">
            <input
              {...register("email")}
              className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
              placeholder="Adresse Mail"
            />
          </div>
          <div className="relative text-center w-w-600">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
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
            <Button
              type="submit"
              className={cn(
                (formState.isSubmitting || !formState.isValid) &&
                  "!cursor-not-allowed opacity-40"
              )}
              disabled={formState.isSubmitting || !formState.isValid}
            >
              Je me connecte
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default LoginForm;
