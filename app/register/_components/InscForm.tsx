import React, { useState } from "react";
import Button from "@/components/BlueButton";
import { User, Cake, Mail, KeyRound, Eye, EyeOff, X } from "lucide-react";
import { InscSchema } from "@/app/schema";
import { InscSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import submitInscForm from "@/actions/insc-form";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/utils/cn";

function InscForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState } = useForm<InscSchemaType>({
    resolver: zodResolver(InscSchema),
  });

  const handleSubmitForm = async (data: InscSchemaType) => {
    const response = await submitInscForm(data);
    if (response.success) {
      redirect("/login");
    } else {
      toast.error(
        response.message ? response.message : response.errors?.[0].message,
        {
          icon: <X />,
          className: "bg-rose-100 border border-rose-50",
        }
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="w-w-600 mx-auto">
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        id="inscform"
        className="w-w-600"
      >
        <div className="relative w-w-600">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
            <User className="mr-4" />
            Pseudo :
          </span>
          <input
            type="text"
            {...register("pseudo")}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Pseudo"
          />
        </div>
        <div className="relative w-w-600">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
            <Cake className="mr-4" />
            Date de naissance :
          </span>
          <input
            type="date"
            {...register("birthday")}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Date de naissance"
          />
        </div>
        <div className="relative w-w-600">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
            <Mail className="mr-4" />
            Adresse Mail :
          </span>
          <input
            type="email"
            {...register("email")}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Adresse Mail"
          />
        </div>
        <div className="relative w-w-600">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
            <KeyRound className="mr-4" />
            Mot de passe :
          </span>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Mot de passe"
          />
          <span
            className="text-gray-600 absolute top-14 right-5 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>
        <div className="relative w-w-600">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
            <KeyRound className="mr-4" />
            Confirmer le mot de passe :
          </span>
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Confirmez votre mot de passe"
          />
          <span
            className="text-gray-600 absolute top-14 right-5 cursor-pointer"
            onClick={toggleConfirmPasswordVisibility}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
            Je m'inscris
          </Button>
        </div>
      </form>
    </div>
  );
}

export default InscForm;
