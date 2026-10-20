"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Newspaper, Search } from "lucide-react";
import { normalizeText } from "@/lib/normalize-text";
import { METHODE_TYPES, MethodeEntry, MethodeType } from "@/lib/methodes";

type TypeFilter = "all" | MethodeType;

const typeLabel = (type: MethodeType) => METHODE_TYPES.find((t) => t.type === type)!.label;

const typeIndex = (entry: MethodeEntry) =>
  METHODE_TYPES.findIndex((t) => t.type === entry.methode.typemethode);

// Par type, puis joueurs et coachs par ordre alphabétique, matchs et saisons par ordre
// chronologique (le type d'abord : sinon années et noms se mélangent et le tri est incohérent)
function compareEntries(a: MethodeEntry, b: MethodeEntry) {
  if (typeIndex(a) !== typeIndex(b)) return typeIndex(a) - typeIndex(b);
  if (a.year !== null && b.year !== null && a.year !== b.year) return a.year - b.year;
  return a.name.localeCompare(b.name, "fr");
}

// Anciens liens partagés (/methodes-expert?m=<id>) : redirigés vers la page de la méthode
export default function MethodesExplorer({ entries }: { entries: MethodeEntry[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const legacyId = searchParams.get("m");

  useEffect(() => {
    const url = legacyId && entries.find((e) => e.methode.id_methode === legacyId)?.url;
    if (url) router.replace(url);
  }, [legacyId, entries, router]);

  return <MethodesExplorerView entries={entries} />;
}

// Sans useSearchParams : rendu au build (fallback du Suspense), pour que toutes les
// fiches soient dans le HTML lu par les moteurs
export function MethodesExplorerView({ entries }: { entries: MethodeEntry[] }) {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const terms = normalizeText(query).split(" ").filter(Boolean);
    return entries
      .filter((e) => typeFilter === "all" || e.methode.typemethode === typeFilter)
      .filter((e) => terms.every((term) => e.search.includes(term)))
      .sort(compareEntries);
  }, [entries, typeFilter, query]);

  const sections = METHODE_TYPES.map(({ type, plural }) => ({
    type,
    plural,
    entries: filtered.filter((e) => e.methode.typemethode === type),
  })).filter((section) => section.entries.length > 0);

  const countByType = (type: TypeFilter) =>
    type === "all" ? entries.length : entries.filter((e) => e.methode.typemethode === type).length;

  return (
    <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-6 sm:p-10 font-Montserrat">
      <h1 className="text-center font-Bai_Jamjuree text-3xl sm:text-4xl font-bold uppercase mb-2">
        Méthodes expert
      </h1>
      <p className="max-w-[700px] mx-auto text-sm sm:text-base text-gray-700 mb-6 sm:mb-10">
        Les fiches des joueurs et des coachs, les compositions des grands matchs et des saisons qui
        ont marqué l&apos;histoire de l&apos;AJ Auxerre.
      </p>

      <div className="max-w-[1500px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            {(["all", ...METHODE_TYPES.map((t) => t.type)] as TypeFilter[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setTypeFilter(type)}
                className={`px-4 py-1.5 rounded-full border transition-colors ${
                  typeFilter === type
                    ? "bg-aja-blue text-white border-aja-blue"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {type === "all" ? "Toutes" : METHODE_TYPES.find((t) => t.type === type)!.plural} (
                {countByType(type)})
              </button>
            ))}
          </div>

          <div className="relative w-full lg:max-w-[350px]">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Joueur, club, saison, stade…"
              aria-label="Rechercher une méthode expert"
              className="w-full h-10 rounded-full pl-11 pr-4 text-sm border border-gray-400 bg-white"
            />
          </div>
        </div>

        {sections.length === 0 ? (
          <p className="py-10 text-gray-600">Aucune méthode ne correspond à votre recherche.</p>
        ) : (
          sections.map((section) => (
            <section key={section.type} className="mb-10 text-left">
              <h2 className="font-Bai_Jamjuree text-xl sm:text-2xl font-bold uppercase mb-4">
                {section.plural} <span className="text-gray-400">({section.entries.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {section.entries.map((entry) => (
                  <MethodeCard key={entry.methode.id_methode} entry={entry} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}

function MethodeCard({ entry }: { entry: MethodeEntry }) {
  const { methode, url, name, subtitle, image, logos, articles } = entry;
  const portrait = methode.typemethode === "joueur" || methode.typemethode === "coach";
  const className =
    "group bg-white rounded-xl overflow-hidden text-left shadow-sm hover:shadow-lg transition-shadow flex flex-col";

  const content = (
    <>
      <div className="relative h-48 bg-gradient-to-b from-aja-blue/10 to-aja-blue/30 flex items-center justify-center overflow-hidden">
        {logos ? (
          <div className="flex items-center gap-4 sm:gap-6">
            <Image src={logos[0]} alt="" width={80} height={80} className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
            <span className="font-Bai_Jamjuree font-bold text-gray-500">VS</span>
            <Image src={logos[1]} alt="" width={80} height={80} className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
          </div>
        ) : image ? (
          <Image
            src={image}
            alt={name}
            width={400}
            height={400}
            className={
              portrait
                ? "w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                : "w-24 h-24 object-contain"
            }
          />
        ) : (
          <Image src="/_assets/img/pdpdebase.png" alt="" width={96} height={96} className="w-24 h-24 rounded-full" />
        )}
        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-white/90 text-aja-blue text-xs font-semibold">
          {typeLabel(methode.typemethode)}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-1 flex-1">
        <p className="font-Bai_Jamjuree font-bold text-lg leading-tight group-hover:text-aja-blue transition-colors">
          {name}
        </p>
        <p className="text-sm text-gray-600 line-clamp-2">{subtitle}</p>
        {articles.length > 0 && (
          <p className="mt-auto pt-2 text-xs text-orange-third font-semibold flex items-center gap-1">
            <Newspaper size={14} /> Cité dans {articles.length} article{articles.length > 1 ? "s" : ""}
          </p>
        )}
      </div>
    </>
  );

  return url ? (
    <Link href={url} className={className}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}
