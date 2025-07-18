import { useGettersContext } from "@/contexts/DataGettersContext"

export default function MethodPopup({ onClose }: { onClose: () => void }) {
    const { articleKeywords, methodes } = useGettersContext();

    console.log(articleKeywords);

    const keywordsList = articleKeywords.flatMap(k => k.keywordsList);

    console.log(keywordsList);

    const filteredMethodes = methodes.filter((methode) =>
        methode.keywords.some((kw) => keywordsList.includes(kw))
    )

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 font-Montserrat"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-6 rounded-xl shadow-lg w-[700px] max-h-[500px] overflow-y-scroll text-center"
            >
                <h2 className="uppercase font-Bai_Jamjuree font-bold text-2xl">Méthodes expert</h2>

                <ul className="text-left mt-4">
                    {filteredMethodes.map((methode) => (
                        <li key={methode.id} className="mb-2">
                            {methode.keywords[0]}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
