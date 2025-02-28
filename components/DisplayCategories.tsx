import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "./BlueButton";

interface Category {
  tag: string;
  value: string;
  img: string;
  type?: string;
}

export default function DisplayCategories() {
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

  const selectRandomCategories = (categories: Category[]) => {
    if (categories.length <= 4) return categories;
    return [...categories].sort(() => Math.random() - 0.5).slice(0, 4);
  };

  useEffect(() => {
    const displayThreeCategories = async () => {
      setIsLoading(true);
      const fetchedCategories = await fetchCategories();

      setCategories(fetchedCategories);
      setRandomSelection(selectRandomCategories(fetchedCategories));
      setIsLoading(false);
    };

    displayThreeCategories();
  }, []);

  return (
    <div>
      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        <div className="flex gap-6 my-10 justify-center">
          {randomSelection.length > 0 ? (
            randomSelection.map((category, index) => (
              <Link href={"#"} key={index}>
                <div className="text-center relative group">
                  <Image
                    src={category.img}
                    width={512}
                    height={512}
                    alt={`Image de ${category.tag}`}
                    className="w-[250px] h-[400px] rounded-xl object-cover transition-all duration-300 
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

      <div className="text-center">
        <Button
          type="button"
          className="transition-all duration-300 hover:bg-white hover:text-aja-blue hover:border hover:border-aja-blue"
        >
          J'accède à toutes les catégories
        </Button>
      </div>
    </div>
  );
}
