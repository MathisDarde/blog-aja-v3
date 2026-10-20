import Image, { StaticImageData } from "next/image";
// Imports statiques : Next.js en tire un aperçu flouté, affiché tant que l'image charge
import verticalPitch from "@/public/_assets/terrains/terraincompletv2.jpg";
import horizontalPitch from "@/public/_assets/terrains/terraincomplet-horizontal.jpg";
import halfPitch from "@/public/_assets/terrains/demiterrain.png";
import Link from "next/link";
import { ArrowBigDown } from "lucide-react";
import { Dispositifs, Poste } from "@/components/Dispositifs";
import { ficheKey } from "@/lib/methodes";

export interface PitchPlayer {
  nom: string;
  poste: string;
  numero: string;
  sortie?: string;
  buts?: string;
  cartonJaune?: boolean;
  cartonRouge?: boolean;
}

export interface PitchTeam {
  players: PitchPlayer[];
  systeme: string;
  // Couleur du maillot et du numéro
  colors: [string, string];
  // Terrain complet : domicile en haut (vertical) ou à gauche (horizontal)
  home?: boolean;
}

// vertical : terrain complet pour le mobile ; horizontal : terrain complet sur grand écran ;
// half : demi-terrain des saisons
export type PitchVariant = "vertical" | "horizontal" | "half";

export const PITCHES: Record<PitchVariant, StaticImageData> = {
  vertical: verticalPitch,
  horizontal: horizontalPitch,
  half: halfPitch,
};

// Diamètre des pastilles des joueurs, en % de la largeur du terrain (24 à 52 px)
const MARKER_SIZE: Record<PitchVariant, number> = { vertical: 7, horizontal: 3.8, half: 4.6 };

// Cartons, proportionnels aux pastilles
const CARD = { width: "calc(var(--marker) * 0.36)", height: "calc(var(--marker) * 0.5)" };

// Écart entre deux lignes d'une équipe sur le terrain horizontal, en % de sa largeur
const HORIZONTAL_LABEL_WIDTH = 10;

// Place les titulaires sur les postes du dispositif (poste exact d'abord, sinon le premier libre).
function placePlayers(players: PitchPlayer[], systeme: string) {
  const dispositif = Dispositifs.find((d) => d.name === systeme);
  if (!dispositif || !Array.isArray(players)) return [];
  const available = [...players];
  return dispositif.postes.flatMap((poste) => {
    const exact = available.findIndex((p) => p.poste === poste.name);
    const [player] = available.splice(exact === -1 ? 0 : exact, 1);
    return player ? [{ player, poste }] : [];
  });
}

const percent = (value: string) => parseFloat(value);

/** Position (en %) et largeur d'étiquette d'un poste selon le terrain. */
function position(poste: Poste, variant: PitchVariant, home: boolean) {
  if (variant === "half") {
    const [left, top] = poste.demiTerrain.split(",").map(percent);
    return { left, top, width: poste.largeur };
  }
  const [x, y] = (home ? poste.positionDom : poste.positionExt).split(",").map(percent);
  if (variant === "vertical") return { left: x, top: y, width: poste.largeur };
  // Terrain tourné d'un quart de tour : le haut passe à gauche, la droite en haut
  return { left: y, top: 100 - x, width: HORIZONTAL_LABEL_WIDTH };
}

const lastName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/);
  return parts.length > 1 ? parts.slice(1).join(" ") : parts[0];
};

export const GoalBadge = ({ buts }: { buts: number }) => (
  <span className="relative bg-white rounded-full shadow-sm border border-gray-200 w-[14px] h-[14px] flex items-center justify-center">
    <Image src="/_assets/img/iconeballon.png" alt="But" width={12} height={12} className="object-contain" />
    {buts > 1 && (
      <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[8px] font-bold w-[11px] h-[11px] flex items-center justify-center rounded-full border border-white">
        {buts}
      </span>
    )}
  </span>
);

function Marker({
  player,
  color,
  text,
  href,
}: {
  player: PitchPlayer;
  color: string;
  text: string;
  href?: string;
}) {
  const goals = Number(player.buts) || 0;
  const label = lastName(player.nom);
  const labelClass = "mt-0.5 block max-w-full truncate text-white px-[0.6em] py-[0.15em] rounded-full shadow-sm";
  const labelStyle = { fontSize: "max(9px, calc(var(--marker) * 0.4))" };

  return (
    <>
      <span className="relative">
        <span
          className="rounded-full flex items-center justify-center shadow-md border font-bold"
          style={{
            width: "var(--marker)",
            height: "var(--marker)",
            fontSize: "calc(var(--marker) * 0.4)",
            backgroundColor: color,
            color: text,
            borderColor: text,
          }}
        >
          {player.numero}
        </span>
        {player.cartonJaune && (
          <span style={CARD} className="absolute -top-1 -right-1 bg-yellow-400 border border-white rounded-sm shadow-sm" />
        )}
        {player.cartonRouge && (
          <span
            style={CARD}
            className={`absolute -top-1 ${player.cartonJaune ? "-right-2.5" : "-right-1"} bg-red-600 border border-white rounded-sm shadow-sm`}
          />
        )}
        {player.sortie && (
          <span className="absolute -bottom-1 -left-2 drop-shadow-md" title={`Sorti à la ${player.sortie}`}>
            <ArrowBigDown
              fill="#f81b1b"
              stroke="#fff"
              strokeWidth={1.5}
              style={{ width: "calc(var(--marker) * 0.65)", height: "calc(var(--marker) * 0.65)" }}
            />
          </span>
        )}
        {goals > 0 && (
          <span className="absolute bottom-0 -right-1">
            <GoalBadge buts={goals} />
          </span>
        )}
      </span>
      {href ? (
        <Link
          href={href}
          title={`Fiche de ${player.nom}`}
          style={labelStyle}
          className={`${labelClass} bg-aja-blue ring-1 ring-white/70 hover:bg-orange-third transition-colors`}
        >
          {label}
        </Link>
      ) : (
        <span title={player.nom} style={labelStyle} className={`${labelClass} bg-black/60`}>
          {label}
        </span>
      )}
    </>
  );
}

/** Terrain avec les titulaires ; les noms des joueurs ayant une fiche mènent à sa page. */
export function Pitch({
  variant,
  teams,
  fiches,
  priority,
}: {
  variant: PitchVariant;
  teams: PitchTeam[];
  fiches: Record<string, string>;
  priority?: boolean;
}) {
  const pitch = PITCHES[variant];

  return (
    <div
      // Vert de la pelouse sous l'image : jamais de fond blanc pendant le chargement
      className="relative w-full rounded-lg bg-[#3d9b2c]"
      // Pastilles et noms proportionnels à la largeur du terrain (unités cqw)
      style={{
        aspectRatio: `${pitch.width} / ${pitch.height}`,
        containerType: "inline-size",
        ["--marker" as string]: `clamp(24px, ${MARKER_SIZE[variant]}cqw, 52px)`,
      }}
    >
      <Image
        src={pitch}
        alt="Terrain"
        fill
        placeholder="blur"
        priority={priority}
        sizes={variant === "horizontal" ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 50vw, 100vw"}
        className="rounded-lg object-cover"
      />
      {teams.flatMap((team, t) =>
        placePlayers(team.players, team.systeme).map(({ player, poste }, i) => {
          const { left, top, width } = position(poste, variant, team.home ?? true);
          return (
            <div
              key={`${t}-${i}`}
              className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ left: `${left}%`, top: `${top}%`, width: `${width}%` }}
            >
              <Marker player={player} color={team.colors[0]} text={team.colors[1]} href={fiches[ficheKey(player.nom)]} />
            </div>
          );
        }),
      )}
    </div>
  );
}

/** Légende des pictogrammes du terrain. */
export function PitchLegend({ events }: { events: boolean }) {
  return (
    <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] sm:text-xs text-gray-500 mt-2">
      {events && (
        <>
          <span className="flex items-center gap-1">
            <GoalBadge buts={1} /> But
          </span>
          <span className="flex items-center gap-1">
            <ArrowBigDown size={14} fill="#f81b1b" stroke="#f81b1b" /> Remplacé
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-3 bg-yellow-400 rounded-[1px]" />
            <span className="w-2 h-3 bg-red-600 rounded-[1px]" /> Cartons
          </span>
        </>
      )}
      <span className="flex items-center gap-1">
        <span className="px-1.5 rounded-full bg-aja-blue text-white text-[10px]">Nom</span> Fiche disponible
      </span>
    </p>
  );
}
