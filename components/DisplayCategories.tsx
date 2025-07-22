import Image from "next/image";
import Link from "next/link";
import Button from "./BlueButton";
import { useGlobalContext } from "@/contexts/GlobalContext";

export default async function DisplayCategories() {
  const { getRandomCategories } = useGlobalContext();

  const rawData = await fetch("/data/articletags.json");
  const categories = await rawData.json();
  const randomCategories = getRandomCategories(categories, 4);

  return (
    <div>
        <div className="flex gap-6 my-10 justify-center">
          {randomCategories.length > 0 ? (
            randomCategories.map((category, index) => (
              <Link href={`/articles?tag=${category.value}`} key={index}>
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
                    className="font-Bai_Jamjuree absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 
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

      <div className="text-center">
        <Link href="/categories">
          <Button type="button">J&apos;accède à toutes les catégories</Button>
        </Link>
      </div>
    </div>
  );
}
