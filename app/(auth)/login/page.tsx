"use client";

import Link from "next/link";
import LoginForm from "./_components/LoginForm";
import handleLoginWithGoogle from "@/actions/user/login-google";
import Image from "next/image";

export default function Login() {
  return (
    <>
      <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-10">
        <h1 className="text-center font-Bai_Jamjuree text-3xl sm:text-4xl font-bold uppercase mb-4">
          Connectez-vous
        </h1>
        <div className="flex flex-col items-center">
          <button className="inline-block text-xs sm:text-sm font-Montserrat text-center m-4 py-2 px-6 rounded-full text-aja-blue bg-white border border-gray-600 transition-all cursor-pointer uppercase font-semibold">
            <Link href="/register">Je ne possède pas de compte</Link>
          </button>

          <button
            className="flex items-center gap-4 bg-white px-4 py-2 rounded-md border border-gray-600"
            onClick={handleLoginWithGoogle}
          >
            <Image
              src="/_assets/img/LogoGoogle.svg"
              width={25}
              height={25}
              alt="Google Logo"
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
            <p className="font-Montserrat text-sm sm:text-base">
              Se connecter avec Google
            </p>
          </button>
        </div>

        <LoginForm />
      </div>
    </>
  );
}
