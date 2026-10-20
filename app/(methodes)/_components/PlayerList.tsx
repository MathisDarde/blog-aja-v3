import Image from "next/image";
import Link from "next/link";
import { ArrowBigUp } from "lucide-react";
import { ficheKey } from "@/lib/methodes";
import { GoalBadge } from "./Pitch";

export interface ListedPlayer {
  nom: string;
  poste: string;
  drapeau?: string;
  entree?: string;
  buts?: string;
  cartonJaune?: boolean;
  cartonRouge?: boolean;
}

/** Nom d'un joueur ou d'un coach, lien vers sa fiche s'il en a une. */
export function PersonName({ name, fiches, className = "" }: { name: string; fiches: Record<string, string>; className?: string }) {
  const href = fiches[ficheKey(name)];
  return href ? (
    <Link href={href} className={`text-aja-blue font-semibold hover:text-orange-third hover:underline ${className}`}>
      {name}
    </Link>
  ) : (
    <span className={className}>{name}</span>
  );
}

/** Remplaçants (banc d'un match, effectif d'une saison). */
export function PlayerList({ players, fiches }: { players: ListedPlayer[]; fiches: Record<string, string> }) {
  if (!players.length) return <p className="text-sm text-gray-400">Non renseigné</p>;

  return (
    <ul className="divide-y divide-gray-100">
      {players.map((player, index) => {
        const goals = Number(player.buts) || 0;
        return (
          <li key={index} className="flex items-center gap-2 py-1.5 text-sm">
            <span className="w-8 shrink-0 text-[11px] font-bold text-gray-400">
              {player.poste ? player.poste.slice(0, 3).toUpperCase() : "–"}
            </span>
            <span className="relative w-5 h-3 shrink-0 border border-gray-400 bg-gray-200 overflow-hidden">
              {player.drapeau && <Image src={player.drapeau} alt="" fill sizes="20px" className="object-cover" />}
            </span>
            <PersonName name={player.nom} fiches={fiches} className="truncate min-w-0" />
            <span className="ml-auto flex items-center gap-2 shrink-0">
              {goals > 0 && <GoalBadge buts={goals} />}
              {player.cartonJaune && <span className="w-2 h-3 bg-yellow-400 border border-gray-300" />}
              {player.cartonRouge && <span className="w-2 h-3 bg-red-600 border border-gray-300" />}
              {player.entree && (
                <span className="flex items-center text-xs font-bold text-green-600" title={`Entré à la ${player.entree}`}>
                  <ArrowBigUp fill="#16a34a" size={14} /> {player.entree}
                </span>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
