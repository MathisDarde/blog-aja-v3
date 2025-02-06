import Link from "next/link";
import LoginForm from "./_components/LoginForm";

async function Login() {
  return (
    <>
      <div className="text-center bg-gray-100 h-screen flex flex-col justify-start items-center">
        <h2 className="font-bold text-4xl font-montserrat uppercase mb-4 mt-10">
          Connectez-vous
        </h2>
        <button className="inline-block text-sm font-montserrat text-center m-4 py-2 px-6 rounded-full text-aja-blue bg-white border border-gray-600 transition-all cursor-pointer uppercase font-semibold">
          <Link href="/register">Je ne possède pas de compte</Link>
        </button>

        <LoginForm />
      </div>
    </>
  );
}

export default Login;
