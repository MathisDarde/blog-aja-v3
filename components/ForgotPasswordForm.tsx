"use client";

import { useState } from "react";
import { toast } from "sonner";
import Button from "@/components/BlueButton";
import { authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

// ✅ Schéma de validation Zod
const formSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse mail valide."),
});

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  // ✅ Affiche les erreurs RHF avec toasts
  const handleFormErrors = () => {
    if (errors.email) toast.error(errors.email.message);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      const { error } = await authClient.requestPasswordReset({
        email: values.email,
        redirectTo: "/reset-password",
      });

      if (error) {
        toast.error("Une erreur est survenue lors de l'envoi de l'email.");
      } else {
        toast.success(
          "Un email de réinitialisation a été envoyé à votre adresse."
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[600px] w-full mx-auto">
      <form
        method="POST"
        id="loginform"
        className="w-full"
        onSubmit={handleSubmit(onSubmit, handleFormErrors)}
      >
        {/* Champ email */}
        <div className="relative w-full mb-6">
          <label className="font-semibold font-Montserrat text-gray-600 block text-left mb-1">
            Adresse mail :
          </label>
          <input
            type="email"
            {...register("email")}
            className="w-full py-3 sm:py-4 px-5 sm:px-6 rounded-full border border-gray-600 font-Montserrat text-xs sm:text-sm"
            placeholder="Entrez votre adresse email"
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading
            ? "Envoi en cours..."
            : "Envoyer le lien de réinitialisation"}
        </Button>
      </form>
    </div>
  );
}
