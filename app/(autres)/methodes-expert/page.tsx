import { Suspense } from "react";
import getAllMethodes from "@/actions/method/get-all-methodes";
import { getArticles } from "@/controllers/ArticlesController";
import { Methodes } from "@/contexts/Interfaces";
import { clubLogoLibraryFinder, findLocalLogo } from "@/lib/club-logos";
import { normalizeText } from "@/lib/normalize-text";
import { MethodeEntry, mentionedMethodes, methodeKey, methodeName } from "@/lib/methodes";
import MethodesExplorer from "./_components/MethodesExplorer";

// Comme /articles : régénérée au plus toutes les 60 s
export const revalidate = 60;

const DEFAULT_LOGO = "/_assets/img/defaultlogoimage.png";
const AJA_LOGO = "/_assets/teamlogos/logoauxerre.svg";

const firstYear = (value: string) => {
  const match = value.match(/\b(19|20)\d{2}\b/);
  return match ? Number(match[0]) : null;
};

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

function describe(
  methode: Methodes,
  clubLogo: (clubName: string) => string,
): Omit<MethodeEntry, "methode" | "name" | "search" | "articles"> & {
  keywords: string[];
} {
  switch (methode.typemethode) {
    case "joueur":
      return {
        subtitle: methode.poste,
        image: methode.imagejoueur || null,
        logos: null,
        year: null,
        keywords: [methode.poste, ...methode.clubs.map((club) => club[1])],
      };
    case "coach": {
      const clubs = methode.clubscoach.map((club) => club[1]);
      return {
        subtitle: clubs.slice(0, 3).join(", ") + (clubs.length > 3 ? "…" : ""),
        image: methode.imagecoach || null,
        logos: null,
        year: null,
        keywords: [...clubs, ...methode.palmares.map((item) => item[0])],
      };
    }
    case "match":
      return {
        subtitle: capitalize(methode.date.replace(/\s+/g, " ").trim()),
        image: null,
        logos: [clubLogo(methode.nomequipe1), clubLogo(methode.nomequipe2)],
        year: firstYear(methode.date),
        keywords: [methode.nomequipe1, methode.nomequipe2, methode.stade, methode.date],
      };
    case "saison":
      return {
        subtitle: `${methode.coach} · ${methode.systeme}`,
        image: AJA_LOGO,
        logos: null,
        year: firstYear(methode.saison),
        keywords: [methode.coach, methode.systeme],
      };
  }
}

export default async function MethodesExpertPage() {
  const [methodes, articles, findLibraryLogo] = await Promise.all([
    getAllMethodes(),
    getArticles(),
    clubLogoLibraryFinder(),
  ]);
  // Logos du dépôt d'abord, puis bibliothèque en base (logos importés depuis Wikidata)
  const clubLogo = (clubName: string) =>
    findLocalLogo(clubName) ?? findLibraryLogo(clubName) ?? DEFAULT_LOGO;

  // Articles citant chaque méthode, du plus récent au plus ancien
  const citations = new Map<string, { slug: string; title: string }[]>();
  for (const article of articles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())) {
    for (const key of mentionedMethodes(article.content)) {
      citations.set(key, [...(citations.get(key) ?? []), { slug: article.slug, title: article.title }]);
    }
  }

  const entries: MethodeEntry[] = ((methodes ?? []) as Methodes[]).map((methode) => {
    const { keywords, ...details } = describe(methode, clubLogo);
    const name = methodeName(methode);
    return {
      methode,
      name,
      ...details,
      search: normalizeText([name, ...keywords].join(" ")),
      articles: citations.get(methodeKey(methode)) ?? [],
    };
  });

  return (
    <Suspense fallback={<div className="p-10 text-center">Chargement des méthodes...</div>}>
      <MethodesExplorer entries={entries} />
    </Suspense>
  );
}
