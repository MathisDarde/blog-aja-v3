"use client";

import displayBrouillons from "@/actions/article/display-brouillons";
import { Article } from "@/contexts/Interfaces";
import Image from "next/image";
import { useEffect, useState } from "react";
import UpdateBrouillonForm from "./_components/UpdateBrouillonForm";

export default function PageBrouillons() {
  const [brouillons, setBrouillons] = useState<Article[]>([]);
  const [selectedBrouillon, setSelectedBrouillon] = useState<Article | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchBrouillons() {
      setLoading(true);
      try {
        const data = await displayBrouillons();
        setBrouillons(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des articles :", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBrouillons();
  }, []);

  const handleEditClick = (brouillon: Article) => {
    setSelectedBrouillon(brouillon);
    setIsEditing(true);
  };

  return (
    <div className="bg-gray-100 h-full w-full p-0 m-0 box-border ">
      {isEditing && selectedBrouillon ? (
        <UpdateBrouillonForm
          articleData={selectedBrouillon}
          setIsEditing={setIsEditing}
          id_article={selectedBrouillon.id_article}
        />
      ) : (
        <>
          <h1 className="font-Bai_Jamjuree font-semibold text-center text-2xl">
            Brouillons
          </h1>

          <div className="grid grid-cols-3 justify-items-center gap-6 my-2 mx-5">
            {loading ? (
              <div className="relative w-full h-64 flex items-center justify-center col-span-2">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-8 rounded-full border-t-8 border-white border-t-aja-blue animate-spin"></div>
              </div>
            ) : brouillons.length === 0 ? (
              <div id="noarticlefound" className="col-span-2">
                <p className="flex items-center justify-center text-2xl font-bold text-center mt-8">
                  Aucun article trouvé.
                </p>
              </div>
            ) : (
              brouillons.map((brouillon, index) => (
                <div
                  key={index}
                  className="w-full h-full"
                  onClick={() => handleEditClick(brouillon)}
                >
                  <div className="flex flex-col bg-white rounded text-center p-6 h-full">
                    <Image
                      className="inline-block w-full h-auto mx-auto rounded-sm object-contain aspect-video object-top"
                      width={512}
                      height={512}
                      src={brouillon.imageUrl || "/_assets/img/pdpdebase.png"}
                      alt={brouillon.title}
                    />
                    <h2 className="text-justify text-black font-semibold font-Montserrat text-lg pt-4 py-2 pr-2 mx-auto">
                      {brouillon.title}
                    </h2>
                    <p className="text-black text-justify font-Montserrat mx-auto text-sm leading-5">
                      {brouillon.teaser}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
