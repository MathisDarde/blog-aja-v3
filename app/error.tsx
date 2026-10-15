"use client";

import Button from "@/components/BlueButton";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="text-center bg-gray-100 h-screen flex flex-col justify-center items-center p-10">
      <h1 className="font-Montserrat text-[6rem] sm:text-[10rem] text-aja-blue leading-none font-semibold">
        Oups
      </h1>
      <p className="font-Montserrat text-lg sm:text-2xl uppercase font-bold text-aja-blue">
        Une erreur est survenue
      </p>
      <p className="font-Montserrat text-sm sm:text-base mt-2 mb-4">
        La page n&apos;a pas pu se charger. Réessayez dans quelques instants.
      </p>

      <div className="flex flex-col sm:flex-row items-center">
        <Button type="button" size="default" onClick={() => reset()}>
          Réessayer
        </Button>
        <Link href={"/"}>
          <Button type="button" size="default">
            Retour vers la page d&apos;accueil
          </Button>
        </Link>
      </div>
    </div>
  );
}
