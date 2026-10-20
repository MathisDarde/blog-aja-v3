import Image from "next/image";
import { CalendarDays, MapPin, Trophy } from "lucide-react";
import type { MethodeCoach, MethodeJoueur, MethodeMatch, MethodeSaison } from "@/contexts/Interfaces";
import { hasScore, isCoachEntry, MethodePageData } from "@/lib/methode-pages";
import { normalizeText } from "@/lib/normalize-text";
import { PITCHES, Pitch, PitchLegend, PitchPlayer } from "./Pitch";
import { ListedPlayer, PersonName, PlayerList } from "./PlayerList";

// « - », « 0 » ou « 000 » : donnée inconnue, pas zéro
const isKnown = (value: string | null | undefined) => !/^\s*(-+|0+)?\s*$/.test(value ?? "");

const isAja = (club: string) => ["aj auxerre", "auxerre"].includes(normalizeText(club));

const card = "bg-white rounded-2xl shadow-sm";
const label = "font-Bai_Jamjuree font-bold text-sm uppercase tracking-wide text-gray-500";

// Ratio largeur / hauteur d'un terrain, pour le dimensionner sur la hauteur de l'écran
const ratio = (variant: keyof typeof PITCHES) => PITCHES[variant].width / PITCHES[variant].height;

// --- Joueurs et coachs ---

/** Photo entière, jamais recadrée : l'encadré prend les proportions de la photo. */
function Portrait({ src, alt, compact }: { src: string | null; alt: string; compact?: boolean }) {
  return (
    <Image
      src={src || "/_assets/img/pdpdebase.png"}
      alt={alt}
      width={800}
      height={600}
      priority
      sizes="(min-width: 1024px) 400px, (min-width: 768px) 320px, 100vw"
      className={`mx-auto w-auto max-w-full h-auto object-contain rounded-xl ${compact ? "max-h-[45svh]" : "max-h-[70svh]"}`}
    />
  );
}

function Clubs({ clubs }: { clubs: [string, string, string][] }) {
  return (
    <ul className="grid gap-1.5 sm:grid-cols-2">
      {clubs.map(([logo, name, years], index) => (
        <li
          key={index}
          className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm ${isAja(name) ? "bg-aja-blue/10 ring-1 ring-aja-blue/30" : "bg-gray-50"}`}
        >
          <Image
            src={logo || "/_assets/img/defaultlogoimage.png"}
            alt=""
            width={28}
            height={28}
            className="w-7 h-7 object-contain shrink-0"
          />
          <span className="font-semibold truncate">{name}</span>
          <span className="ml-auto text-xs text-gray-500 whitespace-nowrap">{years}</span>
        </li>
      ))}
    </ul>
  );
}

function Facts({ items }: { items: [string, string][] }) {
  const known = items.filter(([, value]) => isKnown(value));
  if (!known.length) return null;
  return (
    <dl className="flex flex-wrap gap-2">
      {known.map(([term, value]) => (
        <div key={term} className="rounded-full bg-gray-100 px-3 py-1 text-sm">
          <dt className="inline text-gray-500">{term} : </dt>
          <dd className="inline font-semibold">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

// Fiche ouverte par-dessus un article (panneau ou fenêtre) : une colonne, titre de niveau 2
export interface ViewProps {
  page: MethodePageData;
  compact?: boolean;
}

function ProfileLayout({
  page,
  image,
  compact,
  children,
}: ViewProps & {
  image: string | null;
  children: React.ReactNode;
}) {
  const Title = compact ? "h2" : "h1";
  const columns = compact
    ? ""
    : "md:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]";
  return (
    <article className={`${card} p-4 sm:p-6 grid gap-6 ${columns} items-start`}>
      <Portrait src={image} alt={page.h1} compact={compact} />
      <div className="min-w-0 space-y-5">
        <header>
          <Title className="font-Bai_Jamjuree font-bold text-3xl sm:text-4xl">{page.h1}</Title>
          <p className="mt-2 text-sm sm:text-base text-gray-700 max-w-2xl">{page.intro}</p>
        </header>
        {children}
      </div>
    </article>
  );
}

export function JoueurView({ page, compact }: ViewProps) {
  const m = page.methode as MethodeJoueur;
  const stats = (
    [
      [m.matchs, "Matchs"],
      [m.buts, "Buts"],
      [m.passesd, "Passes déc."],
    ] as const
  ).filter(([value]) => isKnown(value));

  return (
    <ProfileLayout page={page} image={m.imagejoueur} compact={compact}>
      <Facts items={[["Poste", m.poste], ["Taille", m.taille], ["Pied fort", m.piedfort]]} />
      {stats.length > 0 && (
        <section>
          <h2 className={label}>En carrière</h2>
          <div className="mt-2 flex gap-3">
            {stats.map(([value, name]) => (
              <div key={name} className="min-w-[90px] rounded-xl bg-aja-blue/10 px-4 py-2 text-center">
                <p className="font-Bai_Jamjuree font-bold text-2xl sm:text-3xl text-aja-blue">{value}</p>
                <p className="text-xs text-gray-600">{name}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      {m.clubs.length > 0 && (
        <section>
          <h2 className={label}>Clubs</h2>
          <div className="mt-2">
            <Clubs clubs={m.clubs} />
          </div>
        </section>
      )}
    </ProfileLayout>
  );
}

export function CoachView({ page, compact }: ViewProps) {
  const m = page.methode as MethodeCoach;
  const clubs = m.clubscoach.filter(([, name]) => name);
  const palmares = (m.palmares ?? []).filter(([title]) => title);

  return (
    <ProfileLayout page={page} image={m.imagecoach} compact={compact}>
      {clubs.length > 0 && (
        <section>
          <h2 className={label}>Clubs entraînés</h2>
          <div className="mt-2">
            <Clubs clubs={clubs} />
          </div>
        </section>
      )}
      {palmares.length > 0 && (
        <section>
          <h2 className={label}>Palmarès</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {palmares.map(([title, detail], index) => (
              <li key={index} className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-sm ring-1 ring-amber-200">
                <Trophy size={14} className="text-amber-500" />
                <span className="font-semibold">{title}</span>
                {detail && <span className="text-gray-500">({detail})</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
      {isKnown(m.statistiques) && (
        <section>
          <h2 className={label}>Statistiques</h2>
          <p className="mt-2 text-sm sm:text-base text-gray-700">{m.statistiques}</p>
        </section>
      )}
    </ProfileLayout>
  );
}

// --- Matchs ---

const splitBench = (list: ListedPlayer[] | undefined) => {
  const players = Array.isArray(list) ? list : [];
  return {
    bench: players.filter((p) => !isCoachEntry(p.poste)),
    coach: players.find((p) => isCoachEntry(p.poste))?.nom ?? null,
  };
};

function TeamName({ name, logo, reverse }: { name: string; logo?: string; reverse?: boolean }) {
  return (
    <span className={`flex items-center gap-2 sm:gap-3 min-w-0 ${reverse ? "flex-row-reverse text-right" : ""}`}>
      {logo && <Image src={logo} alt="" width={64} height={64} priority className="w-10 h-10 sm:w-14 sm:h-14 object-contain shrink-0" />}
      <span className="text-base sm:text-2xl xl:text-3xl leading-tight">{name}</span>
    </span>
  );
}

function TeamMeta({
  colors,
  systeme,
  coach,
  fiches,
  align,
}: {
  colors: [string, string];
  systeme: string;
  coach: string | null;
  fiches: Record<string, string>;
  align: "left" | "right";
}) {
  return (
    <div className={`text-xs sm:text-sm text-gray-600 space-y-0.5 ${align === "right" ? "text-right" : ""}`}>
      <p className={`flex items-center gap-1.5 ${align === "right" ? "justify-end" : ""}`}>
        <span className="w-3 h-3 rounded-full border border-gray-500" style={{ background: colors[0] }} />
        <span className="w-3 h-3 rounded-full border border-gray-500" style={{ background: colors[1] }} />
        <span>{systeme}</span>
      </p>
      {coach && (
        <p>
          <span className="hidden sm:inline">Entraîneur : </span>
          <PersonName name={coach} fiches={fiches} />
        </p>
      )}
    </div>
  );
}

function Bench({ title, logo, players, fiches }: { title: string; logo?: string; players: ListedPlayer[]; fiches: Record<string, string> }) {
  return (
    <section className="min-w-0">
      <h2 className={`${label} flex items-center gap-2 mb-1`}>
        {logo && <Image src={logo} alt="" width={20} height={20} className="w-5 h-5 object-contain" />}
        {title}
      </h2>
      <PlayerList players={players} fiches={fiches} />
    </section>
  );
}

export function MatchView({ page, compact }: ViewProps) {
  const Title = compact ? "h2" : "h1";
  const m = page.methode as MethodeMatch;
  const team1 = splitBench(m.remplacantsequipe1);
  const team2 = splitBench(m.remplacantsequipe2);
  const colors1: [string, string] = [m.couleur1equipe1, m.couleur2equipe1];
  const colors2: [string, string] = [m.couleur1equipe2, m.couleur2equipe2];
  const teams = [
    { players: m.titulairesequipe1 as PitchPlayer[], systeme: m.systemeequipe1, colors: colors1, home: true },
    { players: m.titulairesequipe2 as PitchPlayer[], systeme: m.systemeequipe2, colors: colors2, home: false },
  ];
  const scored = hasScore(m);
  const extras = [
    m.prolongation ? "Après prolongation" : "",
    m.tabequipe1 != null && m.tabequipe2 != null ? `Tirs au but : ${m.tabequipe1} - ${m.tabequipe2}` : "",
  ].filter(Boolean);
  const short1 = m.abreviationequipe1 || m.nomequipe1;
  const short2 = m.abreviationequipe2 || m.nomequipe2;

  return (
    <article className={card}>
      <header className="px-3 sm:px-8 pt-5 pb-4 border-b border-gray-100">
        {/* Le titre de la page se lit « AJ Auxerre 2 - 0 Borussia Dortmund » */}
        <Title className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 sm:gap-8 font-Bai_Jamjuree font-bold">
          <TeamName name={m.nomequipe1} logo={m.logoequipe1} reverse />{" "}
          <span className="text-3xl sm:text-5xl tabular-nums whitespace-nowrap">
            {scored ? `${m.scoreequipe1} - ${m.scoreequipe2}` : "–"}
          </span>{" "}
          <TeamName name={m.nomequipe2} logo={m.logoequipe2} />
        </Title>
        <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-3 sm:gap-8">
          <TeamMeta colors={colors1} systeme={m.systemeequipe1} coach={team1.coach} fiches={page.fiches} align="right" />
          <p className="text-center text-xs sm:text-sm font-semibold text-gray-600 max-w-[110px] sm:max-w-none">
            {extras.join(" · ")}
          </p>
          <TeamMeta colors={colors2} systeme={m.systemeequipe2} coach={team2.coach} fiches={page.fiches} align="left" />
        </div>
        <p className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-500">
          {m.date && (
            <span className="flex items-center gap-1">
              <CalendarDays size={14} /> {m.date}
            </span>
          )}
          {m.stade && (
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {m.stade}
            </span>
          )}
        </p>
      </header>

      <div className="p-3 sm:p-6 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)_220px] xl:grid-cols-[260px_minmax(0,1fr)_260px] items-start">
        <div className="order-2 lg:order-1">
          <Bench title={`Banc ${short1}`} logo={m.logoequipe1} players={team1.bench} fiches={page.fiches} />
        </div>
        <div className="order-1 lg:order-2 min-w-0">
          {/* Terrain horizontal sur grand écran, vertical sur mobile */}
          <div className="hidden lg:block mx-auto" style={{ width: `min(100%, calc((100svh - 360px) * ${ratio("horizontal")}))` }}>
            <Pitch variant="horizontal" teams={teams} fiches={page.fiches} priority />
          </div>
          <div className="lg:hidden mx-auto max-w-[420px]">
            <Pitch variant="vertical" teams={teams} fiches={page.fiches} />
          </div>
          <PitchLegend events />
        </div>
        <div className="order-3">
          <Bench title={`Banc ${short2}`} logo={m.logoequipe2} players={team2.bench} fiches={page.fiches} />
        </div>
      </div>
    </article>
  );
}

// --- Saisons ---

export function SaisonView({ page, compact }: ViewProps) {
  const Title = compact ? "h2" : "h1";
  const m = page.methode as MethodeSaison;

  return (
    <article className={card}>
      <header className="px-4 sm:px-8 pt-5 pb-4 border-b border-gray-100 flex items-center gap-4">
        {page.logo && <Image src={page.logo} alt="" width={64} height={64} priority className="w-12 h-12 sm:w-16 sm:h-16 object-contain shrink-0" />}
        <div className="min-w-0">
          <Title className="font-Bai_Jamjuree font-bold text-2xl sm:text-4xl">{page.h1}</Title>
          <p className="mt-1 text-sm sm:text-base text-gray-600">
            Entraîneur : <PersonName name={m.coach} fiches={page.fiches} />
            {m.systeme && <> · {m.systeme}</>}
          </p>
        </div>
      </header>

      <div className="p-3 sm:p-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] items-start">
        <div className="min-w-0">
          <div className="mx-auto" style={{ width: `min(100%, calc((100svh - 330px) * ${ratio("half")}))` }}>
            <Pitch
              variant="half"
              teams={[{ players: m.titulaires as PitchPlayer[], systeme: m.systeme, colors: ["#3c77b4", "#ffffff"] }]}
              fiches={page.fiches}
              priority
            />
          </div>
          <PitchLegend events={false} />
        </div>
        <section className="min-w-0">
          <h2 className={`${label} mb-1`}>Remplaçants</h2>
          <PlayerList players={(m.remplacants ?? []) as ListedPlayer[]} fiches={page.fiches} />
        </section>
      </div>
    </article>
  );
}
