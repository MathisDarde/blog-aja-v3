import Image from "next/image";
import Link from "next/link";
import { Newspaper } from "lucide-react";
import categories from "@/public/data/articletags.json";

type Category = (typeof categories)[number];

const SECTIONS = [
  { type: "year", title: "Époques" },
  { type: "league", title: "Compétitions" },
  { type: "player", title: "Joueurs" },
] as const;

const articleCount = (count: number) =>
  count > 0 ? `${count} article${count > 1 ? "s" : ""}` : "Bientôt";

/** Catégories par section ; une catégorie sans article reste visible mais n'est pas cliquable. */
export default function DisplayAllCategories({ counts }: { counts: Record<string, number> }) {
  return (
    <div className="max-w-[1300px] mx-auto text-left">
      {SECTIONS.map(({ type, title }) => {
        const list = categories.filter((c) => c.type === type);
        // Joueurs : les plus racontés d'abord ; époques et compétitions dans l'ordre du fichier
        const sorted =
          type === "player"
            ? [...list].sort((a, b) => (counts[b.value] ?? 0) - (counts[a.value] ?? 0))
            : list;

        return (
          <section key={type} className="mb-10 sm:mb-14">
            <h2 className="font-Bai_Jamjuree text-xl sm:text-2xl font-bold uppercase mb-4">
              {title} <span className="text-gray-400">({list.length})</span>
            </h2>
            {type === "player" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5">
                {sorted.map((category) => (
                  <PlayerCard key={category.id} category={category} count={counts[category.value] ?? 0} />
                ))}
              </div>
            ) : (
              <div
                className={`grid grid-cols-2 gap-3 sm:gap-5 ${
                  type === "year" ? "lg:grid-cols-3" : "lg:grid-cols-5"
                }`}
              >
                {sorted.map((category) => (
                  <CoverCard
                    key={category.id}
                    category={category}
                    count={counts[category.value] ?? 0}
                    tall={type === "league"}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function CategoryLink({
  category,
  count,
  className,
  children,
}: {
  category: Category;
  count: number;
  className: string;
  children: React.ReactNode;
}) {
  if (count === 0) return <div className={`${className} opacity-60`}>{children}</div>;
  return (
    <Link href={`/articles?${category.type}=${category.value}`} className={`${className} group`}>
      {children}
    </Link>
  );
}

/** Époque ou compétition : photo pleine, titre sur un dégradé. */
function CoverCard({ category, count, tall }: { category: Category; count: number; tall: boolean }) {
  return (
    <CategoryLink
      category={category}
      count={count}
      className={`relative block overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-shadow ${
        tall ? "aspect-[4/5] sm:aspect-[4/3] lg:aspect-[3/4]" : "aspect-[4/5] sm:aspect-[16/10]"
      }`}
    >
      <Image
        src={category.img}
        alt=""
        fill
        sizes={tall ? "(min-width: 1024px) 20vw, 50vw" : "(min-width: 1024px) 33vw, 50vw"}
        className={`object-cover object-top transition-transform duration-300 group-hover:scale-105 ${
          count === 0 ? "grayscale" : ""
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 text-white">
        <p className="font-Bai_Jamjuree text-base sm:text-2xl font-bold uppercase leading-tight group-hover:text-orange-third transition-colors">
          {category.tag}
        </p>
        <p className="mt-1 text-xs sm:text-sm font-semibold text-white/80 flex items-center gap-1">
          <Newspaper size={14} /> {articleCount(count)}
        </p>
      </div>
    </CategoryLink>
  );
}

/** Joueur : portrait et nom, comme les cartes des méthodes expert. */
function PlayerCard({ category, count }: { category: Category; count: number }) {
  return (
    <CategoryLink
      category={category}
      count={count}
      className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-200">
        <Image
          src={category.img}
          alt={category.tag}
          fill
          sizes="(min-width: 1280px) 16vw, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
          className={`object-cover object-top transition-transform duration-300 group-hover:scale-105 ${
            count === 0 ? "grayscale" : ""
          }`}
        />
      </div>
      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="font-Bai_Jamjuree font-bold leading-tight group-hover:text-aja-blue transition-colors">
          {category.tag}
        </p>
        <p
          className={`mt-auto text-xs font-semibold flex items-center gap-1 ${
            count > 0 ? "text-orange-third" : "text-gray-400"
          }`}
        >
          <Newspaper size={14} /> {articleCount(count)}
        </p>
      </div>
    </CategoryLink>
  );
}
