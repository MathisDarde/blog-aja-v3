import { useGettersContext } from "@/contexts/DataGettersContext"
import { Methode } from "@/contexts/Interfaces";
import MethodInfo from "./MethodInfo";

export default function MethodPopup({ onClose, activeMethode, setActiveMethode }: { onClose: () => void, activeMethode: Methode[], setActiveMethode: React.Dispatch<React.SetStateAction<Methode[]>> }) {
    const { articleKeywords, methodes } = useGettersContext();

    const keywordsList = articleKeywords.flatMap(k => k.keywordsList);

    const filteredMethodes = methodes.filter((methode) =>
        methode.keywords.some((kw) => keywordsList.includes(kw))
    )

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
                className="bg-white p-6 rounded-xl shadow-lg w-[700px] max-h-[500px] overflow-y-scroll text-center"
            >
                {!activeMethode ? (
                    <>
                        <h2 className="uppercase font-Bai_Jamjuree font-bold text-2xl">Méthodes expert</h2>

                        <ul className="text-left mt-4">
                            {filteredMethodes.map((methode) => (
                                <li key={methode.id_methode} className="mb-2">
                                    {methode.keywords[0]}
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <MethodInfo methode={activeMethode} />
                )}
            </div>
        </div>
    )
}
