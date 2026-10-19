import { Suspense } from "react";
import getAllMethodes from "@/actions/method/get-all-methodes";
import { getArticles } from "@/controllers/ArticlesController";
import { Methodes } from "@/contexts/Interfaces";
import { ajaLogo, DEFAULT_TEAM_LOGO, getTeamLogoResolver, TeamLogoResolver, seasonOfFrenchDate, withPeriodClubLogos } from "@/lib/team-logos";
import { normalizeText } from "@/lib/normalize-text";
import { MethodeEntry, linkMethodes, mentionedMethodes, methodeKey, methodeName } from "@/lib/methodes";
import MethodesExplorer from "./_components/MethodesExplorer";

// Comme /articles : régénérée au plus toutes les 60 s
export const revalidate = 60;

const DEFAULT_LOGO = "/_assets/img/defaultlogoimage.png";

const firstYear = (value: string) => {
  const match = value.match(/\b(19|20)\d{2}\b/);
  return match ? Number(match[0]) : null;
};

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

function describe(
  methode: Methodes,
  clubLogo: (clubName: string, season: number | null) => string,
  resolver: TeamLogoResolver,
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
        // Logos des deux équipes à l'époque du match
        logos: [
          clubLogo(methode.nomequipe1, seasonOfFrenchDate(methode.date)),
          clubLogo(methode.nomequipe2, seasonOfFrenchDate(methode.date)),
        ],
        year: firstYear(methode.date),
        keywords: [methode.nomequipe1, methode.nomequipe2, methode.stade, methode.date],
      };
    case "saison":
      return {
        subtitle: `${methode.coach} · ${methode.systeme}`,
        // Logo de l'AJA à l'époque de la saison
        image: ajaLogo(firstYear(methode.saison), resolver),
        logos: null,
        year: firstYear(methode.saison),
        keywords: [methode.coach, methode.systeme],
      };
  }
}

export default async function MethodesExpertPage() {
  const [methodes, articles, resolver] = await Promise.all([getAllMethodes(), getArticles(), getTeamLogoResolver()]);
  // Logo d'époque ou actuel (lib/team-logos, bibliothèque des méthodes comprise)
  const clubLogo = (clubName: string, season: number | null) => {
    const logo = resolver.logo({ name: clubName, season });
    return logo === DEFAULT_TEAM_LOGO ? DEFAULT_LOGO : logo;
  };

  // Articles citant chaque méthode, du plus récent au plus ancien
  const citations = new Map<string, { slug: string; title: string }[]>();
  for (const article of articles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())) {
    for (const key of mentionedMethodes(linkMethodes(article.content, (methodes ?? []) as Methodes[]))) {
      citations.set(key, [...(citations.get(key) ?? []), { slug: article.slug, title: article.title }]);
    }
  }

  const entries: MethodeEntry[] = ((methodes ?? []) as Methodes[]).map((raw) => {
    const methode = withPeriodClubLogos(raw, resolver);
    const { keywords, ...details } = describe(methode, clubLogo, resolver);
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
