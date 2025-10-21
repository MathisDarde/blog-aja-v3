"use client";

import Link from "next/link";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";

export default function Login() {
  return (
    <>
      <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-6 sm:p-10">
        <div className="bg-white max-w-[800px] rounded-md mx-auto p-6 flex flex-col gap-4">
          <h1 className="text-center font-Bai_Jamjuree text-3xl sm:text-4xl font-bold uppercase mb-4">
            Réinitialisez votre mot de passe
          </h1>
          <div className="flex flex-col items-center">
            <p className="text-aja-blue underline font-Montserrat hover:text-orange-third transition-colors text-sm sm:text-base">
              <Link href="/login">Revenir à la page de connexion</Link>
            </p>
          </div>
          <p className="font-Montserrat text-sm sm:text-base">
            Entrer votre adresse mail ci-dessous afin que nous puissions vous
            envoyer un lien de réinitialisation.
          </p>

          <ForgotPasswordForm />
        </div>
      </div>
    </>
  );
}
