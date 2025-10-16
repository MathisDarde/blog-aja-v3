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
      <button
          type="button"
          className="justify-center items-center bg-aja-blue inline-flex px-6 py-3 rounded-full font-Montserrat text-white text-sm sm:text-base mt-6"
        >
          Retour vers la page d'accueil
        </button>
      </Link>
    </div>
  );
}
