"use client";

import { useRef, useState } from "react";
import { FieldValues, Path, PathValue, UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { type MatchSquadPlayer, loadTeamSquad } from "@/actions/method/wikidata-import";
import { findSquadPlayer } from "@/lib/squad";

type SquadField = "numero" | "poste" | "drapeau";

/**
 * Effectif d'une équipe pour la saison du match (d'après sa date), chargé depuis
 * Wikipédia : propose les joueurs dans les champs de nom, puis complète numéro,
 * poste ou drapeau du joueur choisi. Une valeur entrée à la main n'est jamais écrasée.
 */
export function useTeamSquad<T extends FieldValues>({
  getValues,
  setValue,
  teamField,
}: {
  getValues: UseFormGetValues<T>;
  setValue: UseFormSetValue<T>;
  teamField: Path<T>;
}) {
  const [joueurs, setJoueurs] = useState<MatchSquadPlayer[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const loadedFor = useRef("");
  const autofilled = useRef(new Map<string, string>());

  const get = (path: string) => String(getValues(path as Path<T>) ?? "").trim();

  const ensureSquad = async () => {
    const date = get("date");
    const team = get(teamField);
    const key = `${date}|${team}`;
    if (!date || !team || key === loadedFor.current) return;
    loadedFor.current = key;

    setLoading(true);
    const response = await loadTeamSquad(date, team);
    setLoading(false);

    if (!response.success) {
      loadedFor.current = "";
      setStatus(response.message);
      return;
    }
    const data = response.data;
    setJoueurs(data?.joueurs ?? []);
    setStatus(
      !data
        ? "Renseigne la date du match pour proposer l'effectif"
        : data.joueurs.length > 0
          ? `Effectif ${data.saison} chargé (${data.joueurs.length} joueurs)`
          : `Pas d'effectif Wikipédia pour ${team} en ${data.saison}`,
    );
  };

  /** Complète les champs de la ligne (« titulairesequipe1.3 ») d'après le joueur nommé. */
  const fillFromSquad = (row: string, fields: SquadField[]) => {
    const player = findSquadPlayer(joueurs, get(`${row}.nom`));
    if (!player) return;
    for (const field of fields) {
      const value = player[field];
      const path = `${row}.${field}`;
      const current = get(path);
      if (!value || (current && current !== autofilled.current.get(path))) continue;
      setValue(path as Path<T>, value as PathValue<T, Path<T>>, { shouldDirty: true });
      autofilled.current.set(path, value);
    }
  };

  /** Le nom tapé correspond exactement à un joueur de la liste (choix dans la liste). */
  const isSquadName = (name: string) => joueurs.some((p) => p.nom === name.trim());

  return { joueurs, status, loading, ensureSquad, fillFromSquad, isSquadName };
}
