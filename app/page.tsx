import LastArticle from "@/components/LastPublished";
import DisplayRandom from "@/components/DisplayThreeRandomArticles";
import DisplayCategories from "@/components/DisplayCategories";
import React from "react";
import Carousel from "@/components/carousel/Carousel";
import TeamStatsBlock from "@/components/teamstatshomepage/TeamStatsBlock";
import { readingMinutes } from "@/lib/reading-time";
import { getArticles } from "@/controllers/ArticlesController";
import categories from "@/public/data/articletags.json";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import Timeline from "@/components/timeline/Timeline";
import { TimelineItems } from "@/components/timeline/TimelineItems";
import CitationSlider from "@/components/slidercitations/CitationSlider";
import PagesTilt from "@/components/PagesTilt";
import {
  AJA_ENTITY,
  jsonLd,
  ORGANIZATION_ENTITY,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";

// Régénérée au plus toutes les 60 s (et immédiatement après une action admin
// sur les articles, cf. revalidateArticlePages) au lieu d'être figée au build.
export const revalidate = 60;

export default async function Page() {
  // Sans le contenu HTML : les cartes n'en ont pas besoin et il alourdissait
  // la page de tous les articles du site
  const articles = (await getArticles())?.map(({ content, ...card }) => ({
    ...card,
    readingMinutes: readingMinutes(content),
  }));
  if (!articles) return;

  function getRandomElements<T>(items: T[], amount: number): T[] {
    if (!Array.isArray(items)) return [];
    if (amount >= items.length) return [...items];

    const shuffled = [...items].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, amount);
  }

  const randomCategories = getRandomElements(categories, 7);
  const randomArticles = getRandomElements(articles, 3);
  // Tiré ici, pas dans le composant : le serveur et le navigateur afficheraient deux tirages
  const otherArticles = getRandomElements(articles, 4);

  const siteJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        alternateName: ["Memoire d'Auxerrois", "Mémoire d'Auxerrois – AJ Auxerre"],
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        inLanguage: "fr-FR",
        publisher: { "@id": `${SITE_URL}/#organization` },
        about: { "@id": `${SITE_URL}/#aja` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/articles?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      ORGANIZATION_ENTITY,
      AJA_ENTITY,
    ],
  };

  return (
    <div className="bg-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(siteJsonLd) }}
      />
      <Header />

      <div className="pb-3 max-w-[1300px] mx-auto">
        <Carousel articles={randomArticles} />
      </div>

      <div className="text-center min-h-screen w-screen box-border p-4 sm:p-10 pt-0">
        <div className="my-4">
          <TeamStatsBlock />
        </div>

        <div className="my-6 sm:my-10 text-center px-4 sm:px-0">
          <h1 className="uppercase text-2xl sm:text-3xl lg:text-4xl font-Bai_Jamjuree font-bold text-center mb-6">
            A la une sur Mémoire d&apos;Auxerrois
            <span className="sr-only">, l&apos;histoire de l&apos;AJ Auxerre</span>
          </h1>

          {/* Conteneur principal : Empilé sur mobile, Ligne sur Desktop (lg) */}
          <div className="inline-block bg-white p-4 sm:p-6 w-full max-w-[1300px] shadow-sm">
            <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-6">
              {/* Partie Gauche : Dernier Article (60% sur desktop) */}
              <div className="w-full lg:w-[60%]">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 font-Bai_Jamjuree uppercase text-center lg:text-left w-full">
                  Dernier article publié
                </h2>
                <div className="h-full">
                  <LastArticle articles={articles} />
                </div>
              </div>

              {/* Partie Droite : Recommandations (40% sur desktop) */}
              <div className="w-full lg:w-[40%]">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 font-Bai_Jamjuree uppercase text-center lg:text-left w-full">
                  Articles que vous pourriez aimer
                </h2>
                <div className="w-full">
                  <DisplayRandom articles={otherArticles} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="my-10 text-center">
          <Timeline items={TimelineItems} />
        </div>

        <div className="my-10 text-center">
          <h2 className="uppercase text-2xl sm:text-3xl font-Bai_Jamjuree font-bold text-center">
            Dictons et anecdotes
          </h2>
          <CitationSlider />
        </div>

        <div className="text-center">
          <h2 className="uppercase text-2xl sm:text-3xl font-Bai_Jamjuree font-bold text-center">
            Découvrez l&apos;AJA
          </h2>
          <PagesTilt />
        </div>

        <div className="my-10">
          <h2 className="uppercase text-2xl sm:text-3xl font-Bai_Jamjuree font-bold text-center">
            Catégories
          </h2>
          <div>
            <DisplayCategories randomCategories={randomCategories} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
