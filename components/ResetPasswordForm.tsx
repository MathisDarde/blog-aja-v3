"use client";

import { useState } from "react";
import { toast } from "sonner";
import Button from "@/components/BlueButton";
import { authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    confirmPassword: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // afficher les erreurs via toast
  const handleFormErrors = () => {
    if (errors.password) {
      toast.error(errors.password.message);
    }
    if (errors.confirmPassword) {
      toast.error(errors.confirmPassword.message);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!token) {
      toast.error("Lien de réinitialisation invalide ou expiré.");
      return;
    }

    setLoading(true);

    const { error } = await authClient.resetPassword({
      newPassword: values.password,
      token,
    });

    if (error) {
      toast.error(
        "Une erreur est survenue lors de la réinitialisation du mot de passe."
      );
    } else {
      toast.success("Mot de passe réinitialisé avec succès !");
      router.push("/login");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-[600px] w-full mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit, handleFormErrors)}
        className="w-full text-center"
      >
        {/* Mot de passe */}
        <div className="relative w-full mb-6">
          <label className="font-semibold font-Montserrat text-gray-600 block text-left mb-1">
            Nouveau mot de passe :
          </label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className="w-full py-3 sm:py-4 px-5 sm:px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Nouveau mot de passe"
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="cursor-pointer absolute top-[37px] sm:top-11 right-4 sm:right-5 text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="w-5 sm:w-6" />
            ) : (
              <Eye className="w-5 sm:w-6" />
            )}
          </span>
        </div>

        {/* Confirmation */}
        <div className="relative w-full mb-6">
          <label className="font-semibold font-Montserrat text-gray-600 block text-left mb-1">
            Confirmer le mot de passe :
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            className="w-full py-3 sm:py-4 px-5 sm:px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Confirmez votre mot de passe"
          />
          <span
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="cursor-pointer absolute top-[37px] sm:top-11 right-4 sm:right-5 text-gray-600"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 sm:w-6" />
            ) : (
              <Eye className="w-5 sm:w-6" />
            )}
          </span>
        </div>

        <Button type="submit" size="default" disabled={loading}>
          {loading
            ? "Réinitialisation..."
            : "Confirmer le mot de passe"}
        </Button>
      </form>
    </div>
  );
}
