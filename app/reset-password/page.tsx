"use client";

import ResetPasswordForm from "@/components/ResetPasswordForm";

export default function Login() {
  return (
    <>
      <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-6 sm:p-10">
        <div className="bg-white max-w-[800px] rounded-md mx-auto p-6 flex flex-col gap-4">
          <h1 className="text-center font-Bai_Jamjuree text-3xl sm:text-4xl font-bold uppercase mb-4">
            Saisissez votre nouveau mot de passe
          </h1>

          <ResetPasswordForm />
        </div>
      </div>
    </>
  );
}
