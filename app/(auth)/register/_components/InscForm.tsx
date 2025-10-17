"use client";

import React, { useState } from "react";
import { User, Cake, Mail, KeyRound, Eye, EyeOff, X } from "lucide-react";
import { InscSchema } from "@/app/schema";
import { InscSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import submitInscForm from "@/actions/user/insc-form";
import { toast } from "sonner";
import { useFormErrorToasts } from "@/components/FormErrorsHook";
import Button from "@/components/BlueButton";

function InscForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InscSchemaType>({
    resolver: zodResolver(InscSchema),
  });

  const handleSubmitForm = async (data: InscSchemaType) => {
    const response = await submitInscForm(data);
    if (response.success) {
      window.location.href = "/";
    } else {
      toast.error(
        response.message ? response.message : response.errors?.[0].message
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useFormErrorToasts(errors);

  return (
    <div className="max-w-[600px] mx-auto">
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        id="inscform"
        className="w-full"
      >
        <div className="relative w-full">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
            <User className="mr-4" />
            Pseudo :
          </span>
          <input
            type="text"
            {...register("name")}
            className="w-full my-4 py-3 sm:py-4 px-5 sm:px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Pseudo"
          />
        </div>
        <div className="relative w-full">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
            <Cake className="mr-4" />
            Date de naissance :
          </span>
          <input
            type="date"
            {...register("birthday")}
            className="w-full my-4 py-3 sm:py-4 px-5 sm:px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Date de naissance"
          />
        </div>
        <div className="relative w-full">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
            <Mail className="mr-4" />
            Adresse Mail :
          </span>
          <input
            type="email"
            {...register("email")}
            className="w-full my-4 py-3 sm:py-4 px-5 sm:px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Adresse Mail"
          />
        </div>
        <div className="relative w-full">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
            <KeyRound className="mr-4" />
            Mot de passe :
          </span>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className="w-full my-4 py-3 sm:py-4 px-5 sm:px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Mot de passe"
          />
          <span
            onClick={togglePasswordVisibility}
            className="cursor-pointer absolute top-12 sm:top-14 right-4 sm:right-5 text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="w-5 sm:w-6" />
            ) : (
              <Eye className="w-5 sm:w-6" />
            )}
          </span>
        </div>
        <div className="relative w-full">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
            <KeyRound className="mr-4" />
            Confirmer le mot de passe :
          </span>
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            className="w-full my-4 py-3 sm:py-4 px-5 sm:px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Confirmez votre mot de passe"
          />
          <span
            onClick={toggleConfirmPasswordVisibility}
            className="cursor-pointer absolute top-12 sm:top-14 right-4 sm:right-5 text-gray-600"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 sm:w-6" />
            ) : (
              <Eye className="w-5 sm:w-6" />
            )}
          </span>
        </div>

      
          <Button type="submit" size="default">Je m&apos;inscris</Button>
      </form>
    </div>
  );
}

export default InscForm;
