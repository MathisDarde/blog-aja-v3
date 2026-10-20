import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CrossingLink, hasCrossings, MethodePageData } from "@/lib/methode-pages";

// --- Cartes ---

function ArticleCard({ item }: { item: CrossingLink }) {
  return (
    <Link href={item.url} className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
      <span className="relative aspect-[16/9] bg-gray-200">
        {item.image && (
          <Image src={item.image} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
        )}
      </span>
      <span className="p-3 text-sm font-semibold leading-snug line-clamp-2 group-hover:text-aja-blue">{item.name}</span>
    </Link>
  );
}

const Logo = ({ src, alt }: { src: string | null; alt: string }) =>
  src ? (
    <Image src={src} alt={alt} width={32} height={32} className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0" />
  ) : (
    <span className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
  );

function MatchCard({ item }: { item: CrossingLink }) {
  if (!item.match) return null;
  const [home, away] = item.match.sides;
  const body = (
    <>
      <span className="flex items-center justify-center gap-2">
        <Logo src={home.logo} alt={home.name} />
        <span className="font-Bai_Jamjuree font-bold text-lg tabular-nums whitespace-nowrap">{item.match.score ?? "–"}</span>
        <Logo src={away.logo} alt={away.name} />
      </span>
      <span className="mt-1 block text-center text-xs font-semibold truncate" title={item.name}>
        {home.short} – {away.short}
      </span>
      <span className="block text-center text-[11px] text-gray-500">{item.details}</span>
    </>
  );

  // Le match de la page, repéré dans la frise de sa saison
  if (item.current) {
    return (
      <span className="relative rounded-xl bg-white p-3 ring-2 ring-orange-third" aria-current="page">
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-orange-third px-2 text-[10px] font-bold uppercase text-white">
          Ce match
        </span>
        {body}
      </span>
    );
  }
  return (
    <Link href={item.url} className="rounded-xl bg-white p-3 shadow-sm hover:shadow-md hover:ring-1 hover:ring-aja-blue transition">
      {body}
    </Link>
  );
}

function PersonCard({ item }: { item: CrossingLink }) {
  return (
    <Link href={item.url} className="group flex items-center gap-3 rounded-xl bg-white p-2.5 shadow-sm hover:shadow-md transition-shadow">
      <span className="relative w-11 h-11 shrink-0 overflow-hidden rounded-full bg-gray-200">
        <Image
          src={item.image || "/_assets/img/pdpdebase.png"}
          alt=""
          fill
          sizes="44px"
          className="object-cover object-top"
        />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold leading-tight truncate group-hover:text-aja-blue">{item.name}</span>
        {item.details && <span className="block text-xs text-gray-500 truncate">{item.details}</span>}
      </span>
    </Link>
  );
}

function SeasonCard({ item }: { item: CrossingLink }) {
  return (
    <Link href={item.url} className="group flex items-center gap-3 rounded-xl bg-white p-2.5 shadow-sm hover:shadow-md transition-shadow">
      {item.image && <Image src={item.image} alt="" width={40} height={40} className="w-10 h-10 object-contain shrink-0" />}
      <span className="min-w-0">
        <span className="block text-sm font-semibold leading-tight group-hover:text-aja-blue">{item.name}</span>
        {item.details && <span className="block text-xs text-gray-500 truncate">{item.details}</span>}
      </span>
    </Link>
  );
}

// --- Blocs ---

type Kind = "article" | "match" | "person" | "season";

const GRIDS: Record<Kind, string> = {
  article: "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  match: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
  person: "grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  season: "grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4",
};

// Au-delà, le reste du bloc est replié
const VISIBLE: Record<Kind, number> = { article: 4, match: 12, person: 10, season: 8 };

function Card({ kind, item }: { kind: Kind; item: CrossingLink }) {
  switch (kind) {
    case "article":
      return <ArticleCard item={item} />;
    case "match":
      return <MatchCard item={item} />;
    case "person":
      return <PersonCard item={item} />;
    case "season":
      return <SeasonCard item={item} />;
  }
}

function Block({
  title,
  kind,
  items,
  action,
}: {
  title: string;
  kind: Kind;
  items: CrossingLink[];
  action?: CrossingLink;
}) {
  if (!items.length) return null;
  const visible = items.slice(0, VISIBLE[kind]);
  const hidden = items.slice(VISIBLE[kind]);
  const grid = (list: CrossingLink[]) => (
    <div className={`grid gap-3 ${GRIDS[kind]}`}>
      {list.map((item) => (
        <Card key={item.url} kind={kind} item={item} />
      ))}
    </div>
  );

  return (
    <section>
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <h3 className="font-Bai_Jamjuree font-bold text-base sm:text-lg">
          {title} <span className="text-sm font-medium text-gray-400">{items.filter((i) => !i.current).length || ""}</span>
        </h3>
        {action && (
          <Link href={action.url} className="flex items-center gap-1 text-sm font-semibold text-aja-blue hover:text-orange-third shrink-0">
            {action.name} <ArrowRight size={14} />
          </Link>
        )}
      </div>
      {grid(visible)}
      {hidden.length > 0 && (
        <details className="group mt-3">
          <summary className="cursor-pointer list-none text-sm font-semibold text-aja-blue hover:text-orange-third">
            <span className="group-open:hidden">Voir les {hidden.length} autres</span>
            <span className="hidden group-open:inline">Masquer</span>
          </summary>
          <div className="mt-3">{grid(hidden)}</div>
        </details>
      )}
    </section>
  );
}

/** « Pour aller plus loin » : articles et fiches liées, regroupés selon le type de la page. */
export function Crossings({ page }: { page: MethodePageData }) {
  const { crossings } = page;
  const articles = <Block title="Raconté dans nos articles" kind="article" items={crossings.articles} />;

  const blocks = (() => {
    switch (page.methode.typemethode) {
      case "joueur":
        return (
          <>
            {articles}
            <Block title="Ses matchs" kind="match" items={crossings.matchs} />
            <Block title="Ses saisons à l'AJA" kind="season" items={crossings.saisons} />
          </>
        );
      case "coach":
        return (
          <>
            {articles}
            <Block title="Ses matchs sur le banc" kind="match" items={crossings.matchs} />
            <Block title="Ses saisons à l'AJA" kind="season" items={crossings.saisons} />
          </>
        );
      case "match": {
        const season = crossings.saisons[0];
        return (
          <>
            {articles}
            <Block
              title={`Le parcours de l'AJA en ${page.season}`}
              kind="match"
              items={crossings.matchs}
              action={season && { ...season, name: "Fiche de la saison" }}
            />
            <Block title="Les acteurs du match" kind="person" items={[...crossings.coachs, ...crossings.joueurs]} />
            {/* Saison sans autre match référencé : sa fiche reste accessible */}
            {!crossings.matchs.length && <Block title="La saison" kind="season" items={crossings.saisons} />}
          </>
        );
      }
      case "saison":
        return (
          <>
            {articles}
            <Block title="Les matchs de la saison" kind="match" items={crossings.matchs} />
            <Block title="L'effectif en fiches" kind="person" items={[...crossings.coachs, ...crossings.joueurs]} />
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
