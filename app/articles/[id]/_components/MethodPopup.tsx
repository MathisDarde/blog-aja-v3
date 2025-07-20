import { useGettersContext } from "@/contexts/DataGettersContext";
import { Methode } from "@/contexts/Interfaces";
import MethodInfo from "./MethodInfo";
import { ChevronLeft, X } from "lucide-react";

export default function MethodPopup({
  onClose,
  activeMethode,
  setActiveMethode,
}: {
  onClose: () => void;
  activeMethode: Methode[];
  setActiveMethode: React.Dispatch<React.SetStateAction<Methode[]>>;
}) {
  const { articleKeywords, methodes } = useGettersContext();

  const keywordsList = articleKeywords.flatMap((k) => k.keywordsList);

  const filteredMethodes = methodes.filter((methode) =>
    methode.keywords.some((kw) => keywordsList.includes(kw))
  );

  return (
    <div
      onClick={() => {
        onClose();
        setActiveMethode([]);
      }}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 font-Montserrat"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-xl shadow-lg w-[1000px] max-h-[500px] overflow-y-scroll text-center relative"
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
        {activeMethode.length == 0 ? (
          <>
            <h2 className="uppercase font-Bai_Jamjuree font-bold text-2xl">
              Méthodes expert
            </h2>

            <p className="w-2/3 mx-auto my-3">
              Plongez au coeur des méthodes expert pour revivre ou découvrir des
              matchs et des carrières qui ont marqué l&apos;AJ Auxerre !
            </p>

            <div className="text-center mt-4 space-y-2">
              {filteredMethodes.length > 0 ? (
                <>
                  {filteredMethodes.map((methode: Methode) => (
                    <div
                      key={methode.id_methode}
                      className="flex items-center gap-3 justify-center"
                    >
                      <p
                        onClick={() => setActiveMethode([methode])}
                        className="text-aja-blue cursor-pointer underline"
                      >
                        {methode.keywords[0]}
                      </p>
                      <p className="capitalize">({methode.typemethode})</p>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-center font-Montserrat">
                  Aucune méthode trouvée.
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setActiveMethode([]);
              }}
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
}
