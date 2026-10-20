import Link from "next/link";
import { hasCrossings, MethodePageData } from "@/lib/methode-pages";
import { Block } from "./CrossingCards";

/** « Pour aller plus loin » : articles et fiches liées, regroupés selon le type de la page. */
export function Crossings({ page, compact }: { page: MethodePageData; compact?: boolean }) {
  const { crossings } = page;
  const articles = <Block compact={compact} title="Raconté dans nos articles" kind="article" items={crossings.articles} />;

  const blocks = (() => {
    switch (page.methode.typemethode) {
      case "joueur":
        return (
          <>
            {articles}
            <Block compact={compact} title="Ses matchs" kind="match" items={crossings.matchs} />
            <Block compact={compact} title="Ses saisons à l'AJA" kind="season" items={crossings.saisons} />
          </>
        );
      case "coach":
        return (
          <>
            {articles}
            <Block compact={compact} title="Ses matchs sur le banc" kind="match" items={crossings.matchs} />
            <Block compact={compact} title="Ses saisons à l'AJA" kind="season" items={crossings.saisons} />
          </>
        );
      case "match": {
        const season = crossings.saisons[0];
        return (
          <>
            {articles}
            <Block
              compact={compact}
              title={`Le parcours de l'AJA en ${page.season}`}
              kind="match"
              items={crossings.matchs}
              action={season && { ...season, name: "Fiche de la saison" }}
            />
            <Block compact={compact} title="Les acteurs du match" kind="person" items={[...crossings.coachs, ...crossings.joueurs]} />
            {/* Saison sans autre match référencé : sa fiche reste accessible */}
            {!crossings.matchs.length && <Block compact={compact} title="La saison" kind="season" items={crossings.saisons} />}
          </>
        );
      }
      case "saison":
        return (
          <>
            {articles}
            <Block compact={compact} title="Les matchs de la saison" kind="match" items={crossings.matchs} />
            <Block compact={compact} title="L'effectif en fiches" kind="person" items={[...crossings.coachs, ...crossings.joueurs]} />
          </>
        );
    }
  })();

  return (
    <div className="mt-8 sm:mt-10 font-Montserrat">
      {hasCrossings(crossings) && (
        <>
          <h2 className="font-Bai_Jamjuree font-bold text-xl sm:text-2xl uppercase mb-5">Pour aller plus loin</h2>
          <div className="space-y-8">{blocks}</div>
        </>
      )}
      <Link href="/methodes-expert" className="inline-block mt-8 text-sm text-gray-600 hover:text-aja-blue hover:underline">
        ← Toutes les méthodes expert
      </Link>
    </div>
  );
}
