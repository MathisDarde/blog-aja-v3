"use client";

import { LoginSchema } from "@/app/schema";
import { LoginSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

function LoginForm() {
  const { register, handleSubmit, formState, reset } = useForm<LoginSchemaType>(
    {
      resolver: zodResolver(LoginSchema),
    }
  );

  const handleSubmitForm = async (data : LoginSchemaType) {

  }

  return (
    <div className="w-w-600 mx-auto">
      {errorMessage && (
        <div
          id="error-message"
          className="bg-red-600 text-center w-full py-2 text-white rounded-full my-4"
        >
          {errorMessage}
        </div>
      )}
      <form
        method="POST"
        id="loginform"
        className="w-w-600"
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        <div className="relative text-center w-w-600">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-montserrat text-sm"
            placeholder="Adresse Mail"
          />
        </div>
        <div className="relative text-center w-w-600">
          <input
            type={showPassword ? "text" : "password"} // Toggle password type
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-montserrat text-sm"
            placeholder="Mot de passe"
          />
          <span
            onClick={togglePasswordVisibility}
            className="cursor-pointer absolute top-8 right-5"
          >
            {/* // icone oeil */}
          </span>
        </div>

        <div className="flex justify-center items-center">
          {/* <Button text="Je me connecte" type="submit" /> */}
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
