import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MethodInfo from "@/components/methodes/MethodInfo";
import { Crossings, getMethodePage, isoDate, MethodePageData, shortDate } from "@/lib/methode-pages";
import { MethodeType } from "@/lib/methodes";
import { AJA_ENTITY, jsonLd, paddedSocialImageUrl, SITE_NAME, SITE_URL } from "@/lib/seo";

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

const SECTION_LABELS: Record<MethodeType, Partial<Record<keyof Crossings, string>>> = {
  joueur: {},
  coach: {},
  match: { matchs: "Autres matchs de la saison", joueurs: "Joueurs de la rencontre", coachs: "Entraîneurs" },
  saison: { matchs: "Matchs de la saison", joueurs: "Joueurs de l'effectif", coachs: "Entraîneur" },
};

const DEFAULT_LABELS: Record<keyof Crossings, string> = {
  matchs: "Matchs",
  saisons: "Saisons",
  joueurs: "Joueurs",
  coachs: "Coachs",
  articles: "Cité dans les articles",
};

const SECTION_ORDER: (keyof Crossings)[] = ["articles", "matchs", "saisons", "joueurs", "coachs"];

function CrossingsAside({ type, crossings }: { type: MethodeType; crossings: Crossings }) {
  const sections = SECTION_ORDER.filter((key) => crossings[key].length > 0);

  return (
    <aside className="font-Montserrat">
      {sections.length > 0 && (
        <>
          <h2 className="font-Bai_Jamjuree font-bold text-lg sm:text-xl uppercase mb-3">Pour aller plus loin</h2>
          <div className="space-y-5">
            {sections.map((key) => (
              <section key={key}>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                  {SECTION_LABELS[type][key] ?? DEFAULT_LABELS[key]}
                </h3>
                <ul className="space-y-1">
                  {crossings[key].map((item) => (
                    <li key={item.url} className="text-sm sm:text-base leading-snug">
                      <Link href={item.url} className="text-aja-blue hover:text-orange-third hover:underline">
                        {item.name}
                      </Link>
                      {item.details && <span className="text-gray-500 text-xs sm:text-sm"> · {item.details}</span>}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </>
      )}
      <Link
        href="/methodes-expert"
        className="inline-block mt-6 text-sm text-gray-600 hover:text-aja-blue hover:underline"
      >
        ← Toutes les méthodes expert
      </Link>
    </aside>
  );
}

export async function MethodePage({ type, slug }: { type: MethodeType; slug: string }) {
  const page = await getMethodePage(type, slug);
  if (!page) notFound();

  const date = page.methode.typemethode === "match" ? shortDate(page.methode.date) : null;

  return (
    <div className="p-6 sm:p-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData(page)) }} />

      <div className="max-w-[1200px] mx-auto">
        <nav aria-label="Fil d'Ariane" className="text-xs sm:text-sm text-gray-500 font-Montserrat">
          <Link href="/" className="hover:text-aja-blue hover:underline">Accueil</Link>
          {" / "}
          <Link href="/methodes-expert" className="hover:text-aja-blue hover:underline">Méthodes expert</Link>
          {" / "}
          <span className="text-gray-700">{page.h1}</span>
        </nav>

        <h1 className="font-Bai_Jamjuree font-bold text-2xl sm:text-4xl mt-3">{page.h1}</h1>
        {date && <p className="font-Montserrat text-sm text-gray-500 mt-1">{date}</p>}
        <p className="font-Montserrat text-sm sm:text-base text-gray-700 mt-3 max-w-3xl">{page.intro}</p>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] items-start">
          <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm font-Montserrat text-center">
            <MethodInfo methode={[page.methode]} />
          </section>
          <CrossingsAside type={type} crossings={page.crossings} />
        </div>
      </div>
    </div>
  );
}
