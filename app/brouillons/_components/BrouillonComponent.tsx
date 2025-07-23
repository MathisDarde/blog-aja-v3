"use client";

import { Article } from "@/contexts/Interfaces";
import Image from "next/image";
import { useState } from "react";
import UpdateBrouillonForm from "./UpdateBrouillonForm";

export default function BrouillonComponent({ brouillons } : { brouillons : Article[]}) {
  const [selectedBrouillon, setSelectedBrouillon] = useState<Article | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = (brouillon: Article) => {
    setSelectedBrouillon(brouillon);
    setIsEditing(true);
  };
    return (
        <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-10">
      {isEditing && selectedBrouillon ? (
        <UpdateBrouillonForm
          articleData={selectedBrouillon}
          setIsEditing={setIsEditing}
          id_article={selectedBrouillon.id_article}
        />
      ) : (
        <>
          <h1 className="text-center font-Bai_Jamjuree text-4xl font-bold uppercase mb-10">
            Brouillons
          </h1>

          <div className="grid grid-cols-3 justify-items-center gap-6 my-2 mx-5">
            {brouillons.length === 0 ? (
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
    )
}