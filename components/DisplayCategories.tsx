"use client"

import Image from "next/image";
import Link from "next/link";
import Button from "./BlueButton";
import { Category } from "@/contexts/Interfaces";

export default function BentoCategories({ randomCategories }: { randomCategories: Category[] }) {
  const itemsToDisplay = randomCategories.slice(0, 7);

  // Fonction pour attribuer des tailles différentes (Bento) selon l'index
  const getBentoClass = (index: number) => {
    switch (index) {
      case 0:
        return "md:col-span-2 md:row-span-2"; // La case "Hero" (Grande carrée)
      case 1:
        return "md:col-span-1 md:row-span-1"; // Petite standard
      case 2:
        return "md:col-span-1 md:row-span-2"; // Haute (Portrait)
      case 3:
        return "md:col-span-1 md:row-span-1"; // Petite standard
      case 4:
        return "md:col-span-1 md:row-span-1"; // Petite standard
      case 5:
        return "md:col-span-2 md:row-span-1"; // Large (Paysage)
      case 6:
        return "md:col-span-1 md:row-span-1"; // Petite standard
      default:
        return "md:col-span-1 md:row-span-1";
    }
  };

  return (
    <div className="max-w-[1300px] mx-auto px-4 pt-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[240px]">
        {itemsToDisplay.length > 0 ? (
          itemsToDisplay.map((category, index) => (
            <Link
              href={`/articles?${category.type}=${category.value}`}
              key={index}
              className={`relative group overflow-hidden rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 ${getBentoClass(index)}`}
            >
              {/* Image avec effet de zoom au survol */}
              <Image
                src={category.img}
                width={800}
                height={800}
                alt={`Image de ${category.tag}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 object-top"
              />

              {/* Overlay sombre pour la lisibilité (Gradient du bas vers le haut) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

              {/* Contenu Texte */}
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <span className="inline-block px-3 py-1 mb-2 text-[10px] font-bold text-white uppercase bg-aja-blue/80 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 font-Montserrat">
                    Découvrir
                </span>
                <h3 className="font-Bai_Jamjuree text-white text-xl md:text-2xl font-bold uppercase leading-none transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {category.tag}
                </h3>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-gray-500">
            Aucune catégorie disponible pour le moment.
          </div>
        )}
      </div>

      <div className="text-center">
        <Link href="/categories">
          <Button type="button" size="large">
            J&apos;accède à toutes les catégories
          </Button>
        </Link>
      </div>
    </div>
  );
}