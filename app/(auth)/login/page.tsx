"use client";

import Link from "next/link";
import LoginForm from "./_components/LoginForm";
import handleLoginWithGoogle from "@/actions/user/login-google";

export default function Login() {
  return (
    <>
      <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-10">
        <h1 className="text-center font-Bai_Jamjuree text-4xl font-bold uppercase mb-4">
          Connectez-vous
        </h1>
        <button className="inline-block text-sm font-Montserrat text-center m-4 py-2 px-6 rounded-full text-aja-blue bg-white border border-gray-600 transition-all cursor-pointer uppercase font-semibold">
          <Link href="/register">Je ne possède pas de compte</Link>
        </button>

        <button onClick={handleLoginWithGoogle}>Google</button>

        <LoginForm />
      </div>
    </>
  );
}
