import Button from "@/components/BlueButton";
import Link from "next/link";

export default function NotFound() {
  if (typeof document !== "undefined") {
    document.body.setAttribute("data-page", "404");
  }

  return (
    <div className="text-center bg-gray-100 h-screen flex flex-col justify-center items-center p-10">
      <h1 className="font-Montserrat text-[9rem] sm:text-[15rem] text-aja-blue leading-none font-semibold">
        404
      </h1>
      <p className="font-Montserrat text-lg sm:text-2xl uppercase font-bold text-aja-blue">
        Page non trouvée !
      </p>
      <p className="font-Montserrat text-sm sm:text-base mt-2">
        La page que vous cherchez n&apos;existe pas ou est mal orthographiée.
      </p>
      <p className="font-Montserrat text-sm sm:text-base mt-2">
        Oula, à deux doigts de descendre en National comme le DFCO !
      </p>

      <Link href={"/"}>
      <Button
        >
          Retour vers la page d&apos;accueil
        </Button>
      </Link>
    </div>
  );
}
