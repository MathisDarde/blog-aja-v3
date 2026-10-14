"use client";

import { useRef, useState } from "react";
import { FieldValues, Path, PathValue, UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { toast } from "sonner";
import { importAjaSeason } from "@/actions/method/wikidata-import";
import { findSquadPlayer, type SquadPlayer } from "@/lib/squad";

interface SeasonFields {
  saison: string;
  coach: string;
  systeme: string;
  titulaires: { nom: string; numero: string; poste: string }[];
}

/**
 * Méthode saison : à partir de la saison tapée (« 2021-2022 »), complète le coach et,
 * quand Wikipédia donne l'équipe type, le système et les titulaires. L'effectif chargé
 * sert ensuite à compléter le numéro d'un titulaire dès que son nom est saisi.
 * Rien de ce qui a déjà été rempli à la main n'est écrasé.
 */
export function useSeasonAutofill<T extends FieldValues & SeasonFields>({
  getValues,
  setValue,
}: {
  getValues: UseFormGetValues<T>;
  setValue: UseFormSetValue<T>;
}) {
  const [loading, setLoading] = useState(false);
  const effectif = useRef<SquadPlayer[]>([]);
  const lastSeason = useRef("");

  const set = (path: string, value: string) =>
    setValue(path as Path<T>, value as PathValue<T, Path<T>>, { shouldDirty: true });
  const get = (path: string) => String(getValues(path as Path<T>) ?? "").trim();

  const onSeasonBlur = async () => {
    const saison = get("saison");
    if (!saison || saison === lastSeason.current) return;
    lastSeason.current = saison;

    setLoading(true);
    const response = await importAjaSeason(saison);
    setLoading(false);

    if (!response.success) {
      lastSeason.current = "";
      toast.error(response.message);
      return;
    }
    const season = response.data;
    if (!season) {
      toast.info(`Pas d'article Wikipédia pour la saison ${saison}`);
      return;
    }

    effectif.current = season.effectif;
    if (season.coach && !get("coach")) set("coach", season.coach);

    const titulairesVides = (getValues("titulaires" as Path<T>) as SeasonFields["titulaires"]).every(
      (t) => !t.nom?.trim(),
    );
    if (season.systeme && season.titulaires && titulairesVides) {
      // Le changement de système remplit les postes ; on place ensuite les joueurs
      set("systeme", season.systeme);
      season.titulaires.forEach((t, i) => {
        set(`titulaires.${i}.nom`, t.nom);
        set(`titulaires.${i}.numero`, t.numero);
      });
      toast.success(`Équipe type ${season.saison} importée (${season.systeme})`);
    } else if (season.effectif.length > 0) {
      toast.success(
        `Effectif ${season.saison} chargé : les numéros se complètent quand tu tapes un nom`,
      );
    }
  };

  const onTitulaireBlur = (index: number) => {
    if (get(`titulaires.${index}.numero`)) return;
    const player = findSquadPlayer(effectif.current, get(`titulaires.${index}.nom`));
    if (player?.numero) set(`titulaires.${index}.numero`, player.numero);
  };

  return { loading, onSeasonBlur, onTitulaireBlur };
}
