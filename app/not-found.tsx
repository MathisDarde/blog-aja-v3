import Button from "@/components/BlueButton";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center bg-gray-100 h-screen flex flex-col justify-center items-center">
      <h1 className="font-Montserrat text-maxi-xl text-aja-blue leading-none font-semibold">
        404
      </h1>
      <p className="font-Montserrat text-2xl uppercase font-bold text-aja-blue">
        Page non trouvée !
      </p>
      <p className="font-Montserrat mt-2">
        La page que vous cherchez n&apos;existe pas ou est mal orthographiée.
      </p>
      <p className="font-Montserrat mt-2">
        Oula, à deux doigts de descendre en National comme le DFCO !
      </p>

      <Link href={"/"}>
        <Button type="button">Retour vers la page d&apos;accueil</Button>
      </Link>
    </div>
  );
}
