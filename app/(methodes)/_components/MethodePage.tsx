import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMethodePage, isoDate, MethodePageData } from "@/lib/methode-pages";
import { MethodeType } from "@/lib/methodes";
import { AJA_ENTITY, jsonLd, paddedSocialImageUrl, SITE_NAME, SITE_URL } from "@/lib/seo";
import AdminEditButton from "./AdminEditButton";
import { Crossings } from "./Crossings";
import { CoachView, JoueurView, MatchView, SaisonView } from "./MethodeViews";

// --- Métadonnées ---

export async function methodeMetadata(type: MethodeType, slug: string): Promise<Metadata> {
  const page = await getMethodePage(type, slug);
  if (!page) return { title: "Fiche introuvable", robots: { index: false } };

  const { methode } = page;
  const portrait =
    methode.typemethode === "joueur"
      ? paddedSocialImageUrl(methode.imagejoueur)
      : methode.typemethode === "coach"
        ? paddedSocialImageUrl(methode.imagecoach)
        : null;
  // Matchs et saisons : bannière générée par l'opengraph-image du segment
  const image = portrait && { url: portrait, width: 1200, height: 630, type: "image/jpeg", alt: page.h1 };
  const fullTitle = `${page.title} | ${SITE_NAME}`;

  return {
    title: { absolute: fullTitle },
    description: page.description,
    alternates: { canonical: page.url },
    // Fiche sans lien vers le reste du site : accessible, mais pas proposée aux moteurs
    ...(!page.indexable && { robots: { index: false, follow: true } }),
    openGraph: {
      type: type === "joueur" || type === "coach" ? "profile" : "website",
      title: fullTitle,
      description: page.description,
      url: page.url,
      siteName: SITE_NAME,
      locale: "fr_FR",
      ...(image && { images: [image] }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: page.description,
      ...(image && { images: [image.url] }),
    },
  };
}

// --- Données structurées ---

function structuredData(page: MethodePageData) {
  const { methode } = page;
  const url = `${SITE_URL}${page.url}`;
  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Méthodes expert", item: `${SITE_URL}/methodes-expert` },
      { "@type": "ListItem", position: 3, name: page.h1, item: url },
    ],
  };
  const aja = { "@id": AJA_ENTITY["@id"] };

  const main = (() => {
    switch (methode.typemethode) {
      case "joueur":
        return {
          "@type": "Person",
          name: methode.joueurnom,
          image: methode.imagejoueur || undefined,
          jobTitle: methode.poste ? `Footballeur (${methode.poste.toLowerCase()})` : "Footballeur",
          ...(page.ajaMember && { memberOf: aja }),
          url,
        };
      case "coach":
        return {
          "@type": "Person",
          name: methode.nomcoach,
          image: methode.imagecoach || undefined,
          jobTitle: "Entraîneur de football",
          ...(page.ajaMember && { memberOf: aja }),
          url,
        };
      case "match":
        return {
          "@type": "SportsEvent",
          name: page.h1,
          sport: "Football",
          startDate: isoDate(methode.date) ?? undefined,
          location: methode.stade ? { "@type": "Place", name: methode.stade } : undefined,
          homeTeam: { "@type": "SportsTeam", name: methode.nomequipe1 },
          awayTeam: { "@type": "SportsTeam", name: methode.nomequipe2 },
          description: page.intro,
          url,
        };
      case "saison":
        return { "@type": "WebPage", name: page.h1, description: page.intro, about: aja, url };
    }
  })();

  return { "@context": "https://schema.org", "@graph": [main, breadcrumb, AJA_ENTITY] };
}

// --- Page ---

const VIEWS = { joueur: JoueurView, coach: CoachView, match: MatchView, saison: SaisonView };

export async function MethodePage({ type, slug }: { type: MethodeType; slug: string }) {
  const page = await getMethodePage(type, slug);
  if (!page) notFound();

  const View = VIEWS[type];
  // Joueurs et coachs : la phrase de contexte est sous le nom ; matchs et saisons : sous la fiche
  const introBelow = type === "match" || type === "saison";

  return (
    <div className="px-3 sm:px-6 lg:px-8 py-4 sm:py-5">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData(page)) }} />

      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between gap-3 mb-3">
          <nav aria-label="Fil d'Ariane" className="text-xs sm:text-sm text-gray-500 font-Montserrat truncate">
            <Link href="/" className="hover:text-aja-blue hover:underline">Accueil</Link>
            {" / "}
            <Link href="/methodes-expert" className="hover:text-aja-blue hover:underline">Méthodes expert</Link>
            {" / "}
            <span className="text-gray-700">{page.h1}</span>
          </nav>
          <AdminEditButton id={page.methode.id_methode} />
        </div>

        <div className="font-Montserrat">
          <View page={page} />
        </div>
        {introBelow && <p className="font-Montserrat text-sm text-gray-600 mt-4 max-w-4xl">{page.intro}</p>}

        <Crossings page={page} />
      </div>
    </div>
  );
}
