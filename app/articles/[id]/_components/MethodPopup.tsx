"use client";

import { Article, Methodes } from "@/contexts/Interfaces";
import MethodInfo from "./MethodInfo";
import { ChevronLeft, X } from "lucide-react";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { createPortal } from "react-dom";
import { useEffect, useMemo } from "react";

export default function MethodPopup({
  onClose,
  activeMethode,
  setActiveMethode,
  methodes,
  id_article,
  articles,
}: {
  onClose: () => void;
  activeMethode: Methodes[];
  setActiveMethode: React.Dispatch<React.SetStateAction<Methodes[]>>;
  methodes: Methodes[];
  id_article: string;
  articles: Article[];
}) {
  const { getArticleKeywords } = useGlobalContext();

  const keywords = getArticleKeywords(id_article, articles, methodes);
  const keywordsList = keywords.flatMap((k) => k.keywordsList);
  const filteredMethodes = methodes.filter((methode) =>
    methode.keywords.some((kw) => keywordsList.includes(kw))
  );

  // Création du container pour le portal
  const portalContainer = useMemo(() => {
    const el = document.createElement("div");
    document.body.appendChild(el);
    return el;
  }, []);

  // Bloquer le scroll du body et restaurer au démontage
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const popupContent = (
    <div
      onClick={() => {
        onClose();
        setActiveMethode([]);
      }}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 font-Montserrat"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md sm:max-w-lg m-4 max-h-[90vh] overflow-y-auto relative text-center"
      >
        <button
          onClick={() => {
            onClose();
            setActiveMethode([]);
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <X />
        </button>

        {activeMethode.length === 0 ? (
          <>
            <h2 className="uppercase font-Bai_Jamjuree font-bold text-xl sm:text-2xl mt-4 sm:mt-0">
              Méthodes expert
            </h2>

            <p className="w-full sm:w-2/3 mx-auto my-3 text-sm sm:text-base">
              Plongez au coeur des méthodes expert pour revivre ou découvrir des
              matchs et des carrières qui ont marqué l&apos;AJ Auxerre !
            </p>

            <div className="text-center mt-4 space-y-2">
              {filteredMethodes.length > 0 ? (
                filteredMethodes.map((methode: Methodes) => (
                  <div
                    key={methode.id_methode}
                    className="flex items-center gap-3 justify-center"
                  >
                    <p
                      onClick={() => setActiveMethode([methode])}
                      className="text-aja-blue cursor-pointer underline text-sm sm:text-base"
                    >
                      {methode.keywords[0]}
                    </p>
                    <p className="capitalize text-sm sm:text-base">({methode.typemethode})</p>
                  </div>
                ))
              ) : (
                <p className="text-center font-Montserrat text-sm sm:text-base">
                  Aucune méthode trouvée.
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveMethode([])}
              className="absolute top-4 right-16 text-gray-500 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft />
            </button>

            <MethodInfo methode={activeMethode} />
          </>
        )}
      </div>
    </div>
  );

  return createPortal(popupContent, portalContainer);
}
