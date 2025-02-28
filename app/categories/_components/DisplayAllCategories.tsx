import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Category {
  tag: string;
  value: string;
  img: string;
  type?: string;
}

export default function DisplayAllCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [randomSelection, setRandomSelection] = useState<Category[]>([]);

  const fetchCategories = async (): Promise<Category[]> => {
    try {
      const response = await fetch("/data/articletags.json");
      if (!response.ok) throw new Error("Erreur de chargement du fichier");
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
      return [];
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      const data = await fetchCategories();
      setCategories(data);
      setRandomSelection(data);
      setIsLoading(false);
    };

    loadCategories();
  }, []);

  return (
    <div>
      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid grid-cols-4 gap-10 m-10">
          {randomSelection.length > 0 ? (
            randomSelection.map((category, index) => (
              <Link href={`/articles?tag=${category.value}`} key={index}>
                <div className="text-center relative group">
                  <Image
                    src={category.img}
                    width={512}
                    height={512}
                    alt={`Image de ${category.tag}`}
                    className="w-full h-[400px] rounded-xl object-cover object-top transition-all duration-300 
                               grayscale group-hover:grayscale-0"
                  />

                  <p
                    className="font-Montserrat absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 
                                bg-gray-300 text-gray-700 text-2xl font-bold uppercase w-[90%] rounded-md p-2 
                                transition-all duration-300 group-hover:bg-aja-blue group-hover:text-white"
                  >
                    {category.tag}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p>Aucune catégorie disponible.</p>
          )}
        </div>
      )}
    </div>
  );
}
